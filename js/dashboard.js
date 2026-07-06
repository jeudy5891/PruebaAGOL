let incidentes = [];
let visibleIncidentes = [];
let map, marker, pendingDeleteId = null;
let fpFecha, fpFiltro;
let currentUser = null;

function val(id) { return document.getElementById(id).value.trim(); }
function escapeSql(str) { return String(str).replace(/'/g, "''"); }

function fillSelect(id, options, placeholder) {
  const el = document.getElementById(id);
  el.innerHTML = '';
  el.appendChild(new Option(placeholder || '-- Seleccionar --', ''));
  options.forEach(opt => {
    if (typeof opt === 'object') el.appendChild(new Option(opt.label, opt.value));
    else el.appendChild(new Option(String(opt), String(opt)));
  });
}

function fmtFecha(ms) {
  if (!ms) return '—';
  return new Date(ms).toLocaleString('es-CR', {
    timeZone: 'America/Costa_Rica', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}
function isTodayCR(ms) {
  if (!ms) return false;
  const opts = { timeZone: 'America/Costa_Rica' };
  return new Date(ms).toLocaleDateString('es-CR', opts) === new Date().toLocaleDateString('es-CR', opts);
}
function ymdCR(ms) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Costa_Rica' }).format(new Date(ms));
}

// Fecha (flatpickr "Y-m-d H:i") <-> hora Costa Rica (UTC-6 fijo, sin horario de verano)
function epochToLocalValue(ms) {
  if (!ms) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Costa_Rica', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(new Date(ms));
  const o = {}; parts.forEach(p => o[p.type] = p.value);
  return `${o.year}-${o.month}-${o.day} ${o.hour}:${o.minute}`;
}
function nowLocalValue() { return epochToLocalValue(Date.now()); }
function localValueToEpochUTC(value) {
  if (!value) return null;
  const [datePart, timePart] = value.split(' ');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm] = timePart.split(':').map(Number);
  return Date.UTC(y, m - 1, d, hh + 6, mm, 0); // CR = UTC-6
}
function suggestConsecutivo() {
  const d = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Costa_Rica' }).format(new Date());
  const n = String(Math.floor(Math.random() * 90000 + 10000));
  return `${d}-${n}`;
}

// ---------- Selectores de fecha modernos (flatpickr) ----------
function initDatePickers() {
  fpFecha = flatpickr('#f_Fecha', {
    locale: 'es', enableTime: true, time_24hr: true, dateFormat: 'Y-m-d H:i', allowInput: true
  });
  fpFiltro = flatpickr('#filterFecha', {
    locale: 'es', dateFormat: 'Y-m-d', allowInput: true,
    onChange: applyFilters
  });
}

// ---------- Mapa ----------
function initMapIfNeeded() {
  if (map) return;
  map = L.map('map').setView([9.93, -84.08], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
  map.on('click', e => setMarker(e.latlng.lat, e.latlng.lng));
}
function setMarker(lat, lon) {
  document.getElementById('f_lat').value = lat;
  document.getElementById('f_lon').value = lon;
  if (marker) {
    marker.setLatLng([lat, lon]);
  } else {
    marker = L.marker([lat, lon], { draggable: true }).addTo(map);
    marker.on('dragend', e => { const p = e.target.getLatLng(); setMarker(p.lat, p.lng); });
  }
  map.setView([lat, lon], Math.max(map.getZoom(), 13));
}
function clearMarker() {
  if (marker) { map.removeLayer(marker); marker = null; }
  document.getElementById('f_lat').value = '';
  document.getElementById('f_lon').value = '';
}

// ---------- Carga y render ----------
async function loadIncidentes() {
  const where = currentUser && currentUser.cme
    ? `CME='${escapeSql(currentUser.cme)}'`
    : '1=1';
  const url = `${ARCGIS_LAYER_URL}/query?where=${encodeURIComponent(where)}&outFields=*&orderByFields=objectid DESC&resultRecordCount=200&f=json`;
  const res = await fetch(url);
  const data = await res.json();
  incidentes = (data.features || []).map(f => ({ ...f.attributes, __geometry: f.geometry }));
  refreshFilterOptions();
  applyFilters();
}

function refreshFilterOptions() {
  const regiones = [...new Set(incidentes.map(i => i.Region).filter(Boolean))].sort();
  const cmes = [...new Set(incidentes.map(i => i.CME).filter(Boolean))].sort();
  const curRegion = val('filterRegion'), curCME = val('filterCME');
  fillSelect('filterRegion', regiones, 'Todas');
  fillSelect('filterCME', cmes, 'Todos');
  document.getElementById('filterRegion').value = curRegion;
  document.getElementById('filterCME').value = curCME;
}

function applyFilters() {
  const fecha = val('filterFecha');
  const region = val('filterRegion');
  const cme = val('filterCME');
  const consecutivo = val('filterConsecutivo').toLowerCase();

  const filtered = incidentes.filter(it => {
    if (fecha && (!it.Fecha || ymdCR(it.Fecha) !== fecha)) return false;
    if (region && it.Region !== region) return false;
    if (cme && it.CME !== cme) return false;
    if (consecutivo && !(it.Consecutivo_Completo || '').toLowerCase().includes(consecutivo)) return false;
    return true;
  });
  visibleIncidentes = filtered;
  renderTable(filtered);
  renderKpis(incidentes);
}

function turnoLabel(v) {
  const t = DOMAINS.Turno.find(x => x.value === v);
  return t ? t.label : (v || '');
}

// ---------- Exportar ----------
function exportExcel() {
  const headers = ['Consecutivo', 'Fecha', 'Despachador', 'Turno', 'Tipo de incidente', 'Prioridad', 'Región', 'CME', 'Dirección', 'Persona que reporta', 'Teléfono', 'Observaciones'];
  const rows = visibleIncidentes.map(it => [
    it.Consecutivo_Completo || '', fmtFecha(it.Fecha), it.Despachador || '', turnoLabel(it.Turno), it.Tipo_Incidente || '',
    it.Prioridad_incidente ?? '', it.Region || '', it.CME || '', it.Direccion || '', it.Usuario || '', it.Telefono ?? '', it.Observaciones || ''
  ]);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws['!cols'] = headers.map(() => ({ wch: 18 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Incidentes');
  XLSX.writeFile(wb, `incidentes_${ymdCR(Date.now())}.xlsx`);
}
function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(14);
  doc.text('Informe de Incidentes 911 · CNE', 14, 15);
  doc.setFontSize(9);
  doc.text(`CME: ${currentUser && currentUser.cme ? currentUser.cme : 'Todos'}  ·  Generado: ${new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' })}`, 14, 21);
  doc.autoTable({
    startY: 26,
    head: [['Consecutivo', 'Fecha', 'Despachador', 'Turno', 'Tipo', 'Prioridad', 'Región', 'CME', 'Dirección']],
    body: visibleIncidentes.map(it => [
      it.Consecutivo_Completo || '', fmtFecha(it.Fecha), it.Despachador || '', turnoLabel(it.Turno), it.Tipo_Incidente || '',
      it.Prioridad_incidente ?? '', it.Region || '', it.CME || '', it.Direccion || ''
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [19, 60, 101] }
  });
  doc.save(`incidentes_${ymdCR(Date.now())}.pdf`);
}

function renderTable(list) {
  const tbody = document.getElementById('tableBody');
  const empty = document.getElementById('emptyState');
  if (!list.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  tbody.innerHTML = list.map(it => `
    <tr>
      <td>${it.Consecutivo_Completo || '—'}</td>
      <td>${fmtFecha(it.Fecha)}</td>
      <td>${it.Region || '—'}</td>
      <td>${it.CME || '—'}</td>
      <td style="text-align:right">
        <button class="icon-btn" onclick="editIncidente(${it.objectid})" title="Editar"><i data-lucide="pencil" width="16" height="16"></i></button>
        <button class="icon-btn danger" onclick="deleteIncidente(${it.objectid})" title="Eliminar"><i data-lucide="trash-2" width="16" height="16"></i></button>
      </td>
    </tr>
  `).join('');
  if (window.lucide) lucide.createIcons();
}

function renderKpis(list) {
  document.getElementById('kpiTotal').textContent = list.length;
  document.getElementById('kpiHoy').textContent = list.filter(i => isTodayCR(i.Fecha)).length;
  document.getElementById('kpiP1').textContent = list.filter(i => i.Prioridad_incidente === 1).length;
  document.getElementById('kpiRegiones').textContent = new Set(list.map(i => i.Region).filter(Boolean)).size;
}

// ---------- Modal agregar/editar ----------
function openModal(mode, record) {
  document.getElementById('incidentForm').reset();
  document.getElementById('modalTitle').textContent = mode === 'edit' ? 'Editar incidente' : 'Añadir incidente';
  document.getElementById('modalOverlay').classList.add('open');
  initMapIfNeeded();
  clearMarker();
  setTimeout(() => map.invalidateSize(), 60);

  if (mode === 'edit' && record) {
    populateForm(record);
  } else {
    document.getElementById('f_objectid').value = '';
    fpFecha.setDate(nowLocalValue(), true);
    document.getElementById('f_Consecutivo_Completo').value = suggestConsecutivo();
    document.getElementById('existingAttachments').innerHTML = '';
  }
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }

function populateForm(r) {
  document.getElementById('f_objectid').value = r.objectid;
  fpFecha.setDate(epochToLocalValue(r.Fecha), true);
  document.getElementById('f_Despachador').value = r.Despachador || '';
  document.getElementById('f_Turno').value = r.Turno || '';
  document.getElementById('f_Tipo_Incidente').value = r.Tipo_Incidente || '';
  document.getElementById('f_Prioridad_incidente').value = r.Prioridad_incidente || '';
  document.getElementById('f_Consecutivo_Completo').value = r.Consecutivo_Completo || '';
  document.getElementById('f_Region').value = r.Region || '';
  document.getElementById('f_CME').value = r.CME || '';
  document.getElementById('f_Direccion').value = r.Direccion || '';
  document.getElementById('f_Usuario').value = r.Usuario || '';
  document.getElementById('f_Telefono').value = r.Telefono || '';
  document.getElementById('f_Observaciones').value = r.Observaciones || '';
  document.getElementById('f_Oficial_Enlace').value = r.Oficial_Enlace || '';
  document.getElementById('f_Correo_Oficial').value = r.Correo_Oficial || '';
  document.getElementById('f_Encargado_CME').value = r.Encargado_CME || '';
  document.getElementById('f_Correo_Encargado').value = r.Correo_Encargado || '';
  if (r.__geometry) setMarker(r.__geometry.y, r.__geometry.x);
  loadAttachments(r.objectid);
}

function editIncidente(objectid) {
  const record = incidentes.find(i => i.objectid === objectid);
  if (record) openModal('edit', record);
}

// ---------- Adjuntos ----------
async function loadAttachments(objectid) {
  const container = document.getElementById('existingAttachments');
  container.innerHTML = '';
  if (!objectid) return;
  try {
    const res = await fetch(`${ARCGIS_LAYER_URL}/${objectid}/attachments?f=json`);
    const data = await res.json();
    (data.attachmentInfos || []).forEach(att => {
      const chip = document.createElement('div');
      chip.className = 'attachment-chip';
      chip.innerHTML = `<a href="${ARCGIS_LAYER_URL}/${objectid}/attachments/${att.id}" target="_blank" rel="noopener">${att.name}</a>
        <button type="button" title="Eliminar adjunto"><i data-lucide="x" width="14" height="14"></i></button>`;
      chip.querySelector('button').addEventListener('click', () => deleteAttachment(objectid, att.id));
      container.appendChild(chip);
    });
    if (window.lucide) lucide.createIcons();
  } catch (err) {
    console.error('Error cargando adjuntos', err);
  }
}

async function deleteAttachment(objectid, attId) {
  if (!confirm('¿Eliminar este adjunto?')) return;
  const body = new URLSearchParams();
  body.append('f', 'json');
  body.append('attachmentIds', attId);
  await fetch(`${ARCGIS_LAYER_URL}/${objectid}/deleteAttachments`, { method: 'POST', body });
  loadAttachments(objectid);
}

async function uploadAttachments(objectid, files) {
  for (const file of files) {
    const fd = new FormData();
    fd.append('attachment', file);
    await fetch(`${ARCGIS_LAYER_URL}/${objectid}/addAttachment`, { method: 'POST', body: fd });
  }
}

// ---------- Modal confirmar eliminación ----------
function deleteIncidente(objectid) {
  pendingDeleteId = objectid;
  document.getElementById('confirmOverlay').classList.add('open');
}
function closeConfirm() {
  pendingDeleteId = null;
  document.getElementById('confirmOverlay').classList.remove('open');
}
async function performDelete() {
  const objectid = pendingDeleteId;
  closeConfirm();
  if (!objectid) return;
  const body = new URLSearchParams();
  body.append('f', 'json');
  body.append('objectIds', objectid);
  const res = await fetch(`${ARCGIS_LAYER_URL}/deleteFeatures`, { method: 'POST', body });
  const data = await res.json();
  const result = (data.deleteResults || [])[0];
  if (result && result.success) loadIncidentes();
  else alert('Error al eliminar: ' + JSON.stringify(data));
}

async function saveIncidente(e) {
  e.preventDefault();
  const objectid = val('f_objectid');
  const lat = val('f_lat');
  const lon = val('f_lon');

  const telDigits = val('f_Telefono').replace(/\D/g, '');
  if (telDigits && Number(telDigits) > 2147483647) {
    alert('El teléfono debe tener máximo 10 dígitos.');
    return;
  }
  const telefono = telDigits ? Number(telDigits) : null;

  const attributes = {
    Fecha: localValueToEpochUTC(val('f_Fecha')),
    Despachador: val('f_Despachador'),
    Turno: val('f_Turno'),
    Tipo_Incidente: val('f_Tipo_Incidente'),
    Prioridad_incidente: val('f_Prioridad_incidente') ? Number(val('f_Prioridad_incidente')) : null,
    Consecutivo_Completo: val('f_Consecutivo_Completo'),
    Region: val('f_Region'),
    CME: val('f_CME'),
    Direccion: val('f_Direccion'),
    Usuario: val('f_Usuario'),
    Telefono: telefono,
    Observaciones: val('f_Observaciones'),
    Oficial_Enlace: val('f_Oficial_Enlace'),
    Correo_Oficial: val('f_Correo_Oficial'),
    Encargado_CME: val('f_Encargado_CME'),
    Correo_Encargado: val('f_Correo_Encargado')
  };
  if (objectid) attributes.objectid = Number(objectid);

  const feature = { attributes };
  if (lat && lon) feature.geometry = { x: Number(lon), y: Number(lat), spatialReference: { wkid: 4326 } };

  const endpoint = objectid ? 'updateFeatures' : 'addFeatures';
  const body = new URLSearchParams();
  body.append('f', 'json');
  body.append('features', JSON.stringify([feature]));

  const res = await fetch(`${ARCGIS_LAYER_URL}/${endpoint}`, { method: 'POST', body });
  const data = await res.json();
  const result = (data.addResults || data.updateResults || [])[0];
  if (result && result.success) {
    const savedObjectId = objectid ? Number(objectid) : result.objectId;
    const files = document.getElementById('f_Attachments').files;
    if (files.length) await uploadAttachments(savedObjectId, files);
    closeModal();
    loadIncidentes();
  } else {
    alert('Error al guardar: ' + JSON.stringify(data));
  }
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  const raw = sessionStorage.getItem('usuario');
  if (!raw) { window.location.href = 'index.html'; return; }
  currentUser = JSON.parse(raw);

  const iniciales = String(currentUser.nombre || '?').trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  document.getElementById('profileAvatar').textContent = iniciales || '?';
  document.getElementById('profileName').textContent = currentUser.nombre || currentUser.correo;
  document.getElementById('profileEmail').textContent = currentUser.correo || '';

  fillSelect('f_Despachador', DOMAINS.Despachador);
  fillSelect('f_Turno', DOMAINS.Turno);
  fillSelect('f_Tipo_Incidente', DOMAINS.Tipo_Incidente);
  fillSelect('f_Prioridad_incidente', DOMAINS.Prioridad_incidente);
  fillSelect('f_Region', Object.keys(REGION_DATA));

  document.getElementById('f_Region').addEventListener('change', function () {
    const data = REGION_DATA[this.value];
    document.getElementById('f_CME').value = data ? data.CME : '';
    document.getElementById('f_Oficial_Enlace').value = data ? data.Oficial_Enlace : '';
    document.getElementById('f_Correo_Oficial').value = data ? data.Correo_Oficial : '';
  });

  initDatePickers();
  if (window.lucide) lucide.createIcons();

  const sidebarEl = document.getElementById('sidebar');
  const backdropEl = document.getElementById('sidebarBackdrop');
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  function toggleSidebar() {
    if (isMobile()) {
      sidebarEl.classList.toggle('mobile-open');
      backdropEl.classList.toggle('open');
    } else {
      sidebarEl.classList.toggle('collapsed');
    }
  }
  document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
  document.getElementById('sidebarToggleMobile').addEventListener('click', toggleSidebar);
  backdropEl.addEventListener('click', () => {
    sidebarEl.classList.remove('mobile-open');
    backdropEl.classList.remove('open');
  });

  document.getElementById('btnAdd').addEventListener('click', () => openModal('add'));
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('cancelModal').addEventListener('click', closeModal);
  document.getElementById('incidentForm').addEventListener('submit', saveIncidente);
  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('usuario');
    window.location.href = 'index.html';
  });
  document.getElementById('btnGps').addEventListener('click', () => {
    if (!navigator.geolocation) return alert('Geolocalización no disponible en este navegador.');
    navigator.geolocation.getCurrentPosition(
      pos => setMarker(pos.coords.latitude, pos.coords.longitude),
      err => alert('No se pudo obtener la ubicación: ' + err.message)
    );
  });

  document.getElementById('confirmCancel').addEventListener('click', closeConfirm);
  document.getElementById('confirmAccept').addEventListener('click', performDelete);

  document.getElementById('btnExportExcel').addEventListener('click', exportExcel);
  document.getElementById('btnExportPDF').addEventListener('click', exportPDF);

  ['filterRegion', 'filterCME', 'filterConsecutivo'].forEach(id => {
    document.getElementById(id).addEventListener('input', applyFilters);
    document.getElementById(id).addEventListener('change', applyFilters);
  });

  loadIncidentes();
});
