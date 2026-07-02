document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const msg = document.getElementById('loginMsg');
  const btn = document.getElementById('loginSubmit');
  const correo = document.getElementById('login_Correo').value.trim();
  const password = document.getElementById('login_Password').value;

  if (!GOOGLE_SHEETS_WEBAPP_URL) {
    msg.textContent = '⚠ Falta configurar GOOGLE_SHEETS_WEBAPP_URL en js/config.js';
    return;
  }

  btn.disabled = true;
  msg.textContent = 'Verificando...';

  try {
    const body = new URLSearchParams({ action: 'login', correo, password });
    const res = await fetch(GOOGLE_SHEETS_WEBAPP_URL, { method: 'POST', body });
    const data = await res.json();

    if (data.success) {
      sessionStorage.setItem('usuario', JSON.stringify(data));
      window.location.href = 'dashboard.html';
    } else {
      msg.textContent = data.message || 'Correo o contraseña incorrectos.';
    }
  } catch (err) {
    msg.textContent = 'Error de conexión con Google Sheets: ' + err.message;
  } finally {
    btn.disabled = false;
  }
});
