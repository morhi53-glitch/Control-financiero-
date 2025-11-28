// Navegación entre secciones
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Función para cambiar de sección
    function showSection(sectionId) {
        // Ocultar todas las secciones
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Remover clase active de todos los links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Mostrar sección seleccionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Activar link correspondiente
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    // Event listeners para los links de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Actualizar URL
            history.pushState(null, null, `#${sectionId}`);
        });
    });
    
    // Manejar navegación con botones de retroceso/avance
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1) || 'dashboard';
        showSection(hash);
    });
    
    // Mostrar sección basada en el hash de la URL al cargar
    const initialHash = window.location.hash.substring(1) || 'dashboard';
    showSection(initialHash);
    
    // Ejemplo de datos dinámicos (puedes reemplazar con datos reales)
    console.log('Aplicación de Control Financiero - Transporte Marítimo cargada');
});