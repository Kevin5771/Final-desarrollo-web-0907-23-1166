const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function api(ruta, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${ruta}`, {
      method,
      credentials: 'include', // manda y recibe la cookie de sesión
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Comprueba que esté encendido.');
  }
  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && ruta !== '/api/login') {
    window.dispatchEvent(new Event('sesion-vencida'));
  }
  if (!response.ok) throw new Error(data.error || 'Solicitud fallida.');
  return data;
}
