// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registrado correctamente: ', registration.scope);
      })
      .catch(error => {
        console.log('Error al registrar ServiceWorker: ', error);
      });
  });
}

// Detectar si la app está en modo standalone
function isRunningStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
}

// Instalación de la PWA
let deferredPrompt;
const installContainer = document.getElementById('install-container');
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevenir que el navegador muestre el prompt automático
  e.preventDefault();
  // Guardar el evento para usarlo después
  deferredPrompt = e;
  // Mostrar el botón de instalación
  installContainer.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    // Mostrar el prompt de instalación
    deferredPrompt.prompt();
    // Esperar a que el usuario responda
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // Limpiar el evento guardado
    deferredPrompt = null;
    // Ocultar el botón de instalación
    installContainer.style.display = 'none';
  }
});

window.addEventListener('appinstalled', () => {
  console.log('PWA instalada correctamente');
  deferredPrompt = null;
  installContainer.style.display = 'none';
});

// Detectar cambios de conexión
window.addEventListener('online', () => {
  showNotification('Conexión restaurada', 'success');
});

window.addEventListener('offline', () => {
  showNotification('Sin conexión - Modo offline activado', 'warning');
});

// Notificaciones
function showNotification(message, type = 'info') {
  // Crear notificación simple
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#2ecc71' : type === 'warning' ? '#f39c12' : '#3498db'};
    color: white;
    border-radius: 5px;
    z-index: 10000;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    animation: slideIn 0.3s ease;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Añadir estilos para la animación
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  .install-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }
`;
document.head.appendChild(style);