document.addEventListener('DOMContentLoaded', () => {
  // Pestañas
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginPanel.style.display = 'block';
    registerPanel.style.display = 'none';
  });
  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerPanel.style.display = 'block';
    loginPanel.style.display = 'none';
  });

  // Región -> CME (mismos datos de prueba usados en el dashboard)
  const regionSelect = document.getElementById('reg_Region');
  regionSelect.innerHTML = '<option value="">-- Seleccionar --</option>' +
    Object.keys(REGION_DATA).map(r => `<option value="${r}">${r}</option>`).join('');

  regionSelect.addEventListener('change', function () {
    const data = REGION_DATA[this.value];
    document.getElementById('reg_CME').value = data ? data.CME : '';
  });

  // Envío del registro a Google Sheets (vía Apps Script Web App)
  document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const msg = document.getElementById('registerMsg');

    if (!GOOGLE_SHEETS_WEBAPP_URL) {
      msg.textContent = '⚠ Falta configurar GOOGLE_SHEETS_WEBAPP_URL en js/config.js';
      return;
    }

    const body = new URLSearchParams({
      nombre: document.getElementById('reg_Nombre').value.trim(),
      correo: document.getElementById('reg_Correo').value.trim(),
      region: document.getElementById('reg_Region').value,
      cme: document.getElementById('reg_CME').value,
      password: document.getElementById('reg_Password').value
    });

    const btn = this.querySelector('button[type="submit"]');
    btn.disabled = true;
    msg.textContent = 'Guardando...';
    try {
      const res = await fetch(GOOGLE_SHEETS_WEBAPP_URL, { method: 'POST', body });
      const data = await res.json();
      if (data.result === 'success') {
        msg.textContent = '✓ Registro guardado. Ya puedes iniciar sesión.';
        this.reset();
        document.getElementById('reg_CME').value = '';
      } else {
        msg.textContent = 'Error al guardar: ' + JSON.stringify(data);
      }
    } catch (err) {
      msg.textContent = 'Error de conexión con Google Sheets: ' + err.message;
    } finally {
      btn.disabled = false;
    }
  });
});
