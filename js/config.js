// Capa de PRUEBAS (segura para crear/editar/borrar mientras se prueba el sitio).
const ARCGIS_LAYER_URL = "https://services8.arcgis.com/XvhbIGOePiqXJBao/arcgis/rest/services/service_30876ae0faa848a88cfa5da8fb152430/FeatureServer/0";

const DOMAINS = {
  Despachador: [
    "Sr. Esteban Araya", "Sr. Jefferson Cruz Reyes", "Sr. Jorge Eduardo Pérez Gómez",
    "Sr. José Rodriguez", "Sr. José Alberto Quirós Gamboa", "Sra. Dariana Barrera",
    "Sra. Josseline Cortés", "Sra. Kattia Ureña", "Sra. María Godinez", "Sr. Juan José Dittel"
  ],
  Turno: [
    { label: "06:00 - 14:00 HRS", value: "06:00_14:00_HRS" },
    { label: "14:00 - 21:00 HRS", value: "14:00_21:00_HRS" },
    { label: "21:00 - 06:00 HRS", value: "21:00_6:00_HRS" }
  ],
  Tipo_Incidente: [
    "Actividad Volcanica", "Ambiental", "Avalancha o flujos de lodo", "Bitacora de Operativos",
    "CNE - Asuntos internos", "CNE - consulta de incidentes", "CNE - gestiones", "CNE - gestiones COVID",
    "Contra la propiedad", "Declaratoria de alerta CNE", "Denuncias", "Deslizamiento",
    "Emergencias Aereas", "Evento sismico", "Fuertes Vientos", "Incendio Estructural",
    "Incendio Forestal", "Inundaciones", "Materiales Peligrosos", "Otros",
    "Problemas de tránsito", "Rescates", "Revisiones", "Simulacros",
    "Solicitud de Inspección", "Tránsito gestiones", "Tsunami", "Urgencia Médica"
  ],
  Prioridad_incidente: [1, 2, 3, 4]
};

// Datos de prueba: al elegir Región, se precargan CME y Oficial de enlace.
const REGION_DATA = {
  "San José Oeste": {
    CME: "Aserrí",
    Oficial_Enlace: "Ana Gabriela Mora Matarrita",
    Correo_Oficial: "amoram@cne.go.cr"
  },
  "Brunca": {
    CME: "Osa",
    Oficial_Enlace: "Karol Fallas Trejos",
    Correo_Oficial: "kfallas@cne.go.cr"
  }
};

// URL del Web App de Google Apps Script (ver instrucciones de despliegue).
// Debe terminar en "/exec". Mientras esté vacía, el registro no podrá guardar datos.
const GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbx1vXg6vZ4WYZsU-Wad6-Qw57JLosPlful-uBxgUJ02Ua2kFLDSxFYpzyVRrC619ZBXzQ/exec";
