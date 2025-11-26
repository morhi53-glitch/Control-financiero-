// Gestión de la PWA
class PWAHelper {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupNetworkDetection();
        this.checkStandaloneMode();
        this.setupOfflineUI();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        console.log('✅ ServiceWorker registrado correctamente: ', registration.scope);
                        
                        // Verificar actualizaciones cada vez que se carga la página
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            console.log('🔄 Nuevo Service Worker encontrado:', newWorker);
                            
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    this.showNotification('Nueva versión disponible. Recarga la página para actualizar.', 'info');
                                }
                            });
                        });
                    })
                    .catch(error => {
                        console.log('❌ Error al registrar ServiceWorker: ', error);
                    });
            });

            // Escuchar cambios de controlador (actualizaciones)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('🎯 Controller changed - Page reload recommended');
                this.showNotification('Aplicación actualizada. Recargando...', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            });
        }
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
            
            console.log('📱 Evento beforeinstallprompt capturado');
            
            // Mostrar automáticamente después de 5 segundos si el usuario no ha interactuado
            setTimeout(() => {
                if (this.deferredPrompt && !this.isRunningStandalone()) {
                    this.showInstallButton();
                }
            }, 5000);
        });

        window.addEventListener('appinstalled', () => {
            console.log('🎉 PWA instalada correctamente');
            this.deferredPrompt = null;
            this.hideInstallButton();
            this.showNotification('¡Aplicación instalada correctamente!', 'success');
            
            // Analytics o tracking de instalación
            this.trackInstallation();
        });

        // Configurar botón de instalación
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.addEventListener('click', () => this.installApp());
        }
    }

    async installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            console.log(`Usuario ${outcome} la instalación`);
            
            if (outcome === 'accepted') {
                this.deferredPrompt = null;
                this.hideInstallButton();
            }
        } else {
            this.showNotification('La aplicación ya está instalada o no se puede instalar en este navegador.', 'warning');
        }
    }

    showInstallButton() {
        const installContainer = document.getElementById('install-container');
        if (installContainer && !this.isRunningStandalone()) {
            installContainer.style.display = 'block';
            
            // Ocultar automáticamente después de 30 segundos
            setTimeout(() => {
                this.hideInstallButton();
            }, 30000);
        }
    }

    hideInstallButton() {
        const installContainer = document.getElementById('install-container');
        if (installContainer) {
            installContainer.style.display = 'none';
        }
    }

    setupNetworkDetection() {
        // Estado inicial
        if (!navigator.onLine) {
            this.showOfflineIndicator();
        }

        window.addEventListener('online', () => {
            console.log('🌐 Conexión restaurada');
            this.hideOfflineIndicator();
            this.showNotification('Conexión a internet restaurada', 'success');
            
            // Sincronizar datos si es necesario
            this.syncData();
        });

        window.addEventListener('offline', () => {
            console.log('📴 Sin conexión a internet');
            this.showOfflineIndicator();
            this.showNotification('Modo offline activado. Los datos se guardarán localmente.', 'warning');
        });
    }

    showOfflineIndicator() {
        // Crear o mostrar indicador offline
        let offlineIndicator = document.getElementById('offline-indicator');
        if (!offlineIndicator) {
            offlineIndicator = document.createElement('div');
            offlineIndicator.id = 'offline-indicator';
            offlineIndicator.className = 'offline-warning';
            offlineIndicator.innerHTML = `
                <i class="fas fa-wifi"></i>
                <span>Modo offline - Sin conexión a internet</span>
            `;
            document.body.appendChild(offlineIndicator);
        }
        offlineIndicator.style.display = 'block';
    }

    hideOfflineIndicator() {
        const offlineIndicator = document.getElementById('offline-indicator');
        if (offlineIndicator) {
            offlineIndicator.style.display = 'none';
        }
    }

    setupOfflineUI() {
        // Mejorar UX para modo offline
        document.addEventListener('DOMContentLoaded', () => {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    if (!navigator.onLine) {
                        this.showNotification('Los datos se guardarán localmente y se sincronizarán cuando recuperes la conexión.', 'info');
                    }
                });
            });
        });
    }

    checkStandaloneMode() {
        if (this.isRunningStandalone()) {
            document.body.classList.add('standalone-mode');
            console.log('📱 Ejecutándose en modo standalone');
        }
    }

    isRunningStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true ||
               document.referrer.includes('android-app://');
    }

    showNotification(message, type = 'info') {
        // Eliminar notificación anterior si existe
        const existingNotification = document.querySelector('.pwa-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `pwa-notification pwa-notification-${type}`;
        notification.innerHTML = `
            <div class="pwa-notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('pwa-notification-hide');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    trackInstallation() {
        // Aquí puedes agregar analytics o tracking de instalaciones
        console.log('📊 Tracking de instalación - PWA instalada');
        
        // Ejemplo: Guardar en localStorage que la app fue instalada
        localStorage.setItem('pwa_installed', new Date().toISOString());
    }

    syncData() {
        // Aquí puedes agregar lógica de sincronización cuando se recupera la conexión
        console.log('🔄 Sincronizando datos...');
        
        // Ejemplo: Mostrar notificación de sincronización
        this.showNotification('Sincronizando datos con el servidor...', 'info');
        
        // Simular sincronización
        setTimeout(() => {
            this.showNotification('Datos sincronizados correctamente', 'success');
        }, 2000);
    }

    // Método para verificar si la PWA es instalable
    isPWAInstallable() {
        return this.deferredPrompt !== null;
    }

    // Método para obtener información de la PWA
    getPWAInfo() {
        return {
            isStandalone: this.isRunningStandalone(),
            isInstallable: this.isPWAInstallable(),
            isOnline: navigator.onLine,
            storage: {
                transactions: localStorage.getItem('maritimeTransactions') ? JSON.parse(localStorage.getItem('maritimeTransactions')).length : 0,
                ships: localStorage.getItem('maritimeShips') ? JSON.parse(localStorage.getItem('maritimeShips')).length : 0
            }
        };
    }
}

// Inicializar PWA cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.pwaHelper = new PWAHelper();
    
    // Exponer métodos útiles globalmente
    window.getPWAInfo = () => window.pwaHelper.getPWAInfo();
    window.installPWA = () => window.pwaHelper.installApp();
});

// Manejar eventos de visibilidad de página para mejor performance
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // La página es visible again - podrías actualizar datos aquí
        console.log('📄 Página visible - Actualizando datos si es necesario');
    }
});

// Prevenir acciones por defecto en enlaces y formularios para SPA experience
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
    }
});

// Mejorar performance en móviles
if ('connection' in navigator) {
    const connection = navigator.connection;
    if (connection.saveData) {
        console.log('📱 Modo ahorro de datos activado');
        // Podrías cargar menos recursos aquí
    }
}