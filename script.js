// ========== AURA - SCRIPT COMPLETO Y CORREGIDO ==========
// Incluye: navbar responsive, scroll suave, cierre automático del menú, manejo de errores

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== 1. CONFIGURACIÓN GLOBAL ==========
    const navbar = document.querySelector('.aura-navbar-white');
    const navbarHeight = navbar ? navbar.offsetHeight : 74;
    const toggler = document.querySelector('.navbar-toggler');
    const collapseElement = document.getElementById('navbarToggleExternalContent');
    
    // Inicializar Bootstrap Collapse si existe
    let bsCollapse = null;
    if (collapseElement && typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
        try {
            bsCollapse = new bootstrap.Collapse(collapseElement, {
                toggle: false
            });
        } catch(e) {
            console.log('Bootstrap Collapse no inicializado:', e);
        }
    }
    
    // ========== 2. CERRAR MENÚ AL HACER CLIC EN UN ENLACE ==========
    const navLinks = document.querySelectorAll('.collapse-link-white, .nav-list a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Cerrar el menú después de un pequeño delay (permite que el scroll comience)
            setTimeout(function() {
                // Método 1: usando Bootstrap Collapse
                if (bsCollapse) {
                    bsCollapse.hide();
                }
                // Método 2: manual (fallback)
                if (collapseElement) {
                    collapseElement.classList.remove('show');
                }
                // Actualizar el botón toggler
                if (toggler) {
                    toggler.setAttribute('aria-expanded', 'false');
                    toggler.classList.add('collapsed');
                }
            }, 150);
        });
    });
    
    // ========== 3. SCROLL SUAVE CON AJUSTE DE NAVBAR ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#" || targetId === "" || targetId === "#inicio" && window.location.hash === "#inicio") {
                // Permitir comportamiento normal para #inicio si ya está
                if (targetId === "#inicio") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Calcular posición restando la altura de la navbar
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Actualizar URL sin saltar (opcional)
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // ========== 4. (El menú desplegable no necesita reposicionar la página al abrir) ==========
    
    // ========== 5. CERRAR MENÚ AL HACER SCROLL (solo scroll deliberado del usuario) ==========
    let scrollTimeout;
    let menuOpenedAt = 0;
    let scrollPosAtOpen = 0;

    // Registrar cuándo y dónde se abrió el menú
    if (collapseElement) {
        collapseElement.addEventListener('shown.bs.collapse', function() {
            menuOpenedAt = Date.now();
            scrollPosAtOpen = window.scrollY;
        });
    }

    window.addEventListener('scroll', function() {
        if (!collapseElement || !collapseElement.classList.contains('show')) return;

        // Ignorar el scroll que ocurre justo al abrir el menú (reposicionamiento automático)
        if (Date.now() - menuOpenedAt < 600) return;

        // Solo cerrar si el usuario scrolleó una distancia real (no un par de píxeles)
        if (Math.abs(window.scrollY - scrollPosAtOpen) < 40) return;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            if (bsCollapse) {
                bsCollapse.hide();
            }
            if (collapseElement) {
                collapseElement.classList.remove('show');
            }
            if (toggler) {
                toggler.setAttribute('aria-expanded', 'false');
                toggler.classList.add('collapsed');
            }
        }, 300);
    });
    
    // ========== 6. SINCRONIZAR ESTADO DEL TOGGLER (EVITAR BUGS) ==========
    if (toggler && collapseElement) {
        // Escuchar eventos de Bootstrap para mantener sincronizado
        collapseElement.addEventListener('shown.bs.collapse', function() {
            toggler.setAttribute('aria-expanded', 'true');
            toggler.classList.remove('collapsed');
        });
        
        collapseElement.addEventListener('hidden.bs.collapse', function() {
            toggler.setAttribute('aria-expanded', 'false');
            toggler.classList.add('collapsed');
        });
    }
    
    // ========== 7. MANEJO DE ERRORES DE LOGO (FALLBACK) ==========
    const logoImages = document.querySelectorAll('.hero-logo, .aura-nav-logo-white, .footer-logo-img');
    logoImages.forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Logo no encontrado:', this.src);
            // Si el logo falla, ocultarlo y mostrar texto alternativo
            if (this.classList.contains('hero-logo')) {
                this.style.display = 'none';
                const heroTitle = document.querySelector('.hero-title');
                if (heroTitle) heroTitle.style.marginTop = '20px';
            }
            if (this.classList.contains('aura-nav-logo-white')) {
                this.style.display = 'none';
                const brandText = document.querySelector('.aura-brand-text-white');
                if (brandText) brandText.style.marginLeft = '0';
            }
        });
    });
    
    // ========== 8. CORREGIR SOLAPAMIENTO AL CARGAR CON HASH EN URL ==========
    if (window.location.hash) {
        setTimeout(function() {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 300);
    }
    
    // ========== 9. AJUSTAR ALTURA DE NAVBAR EN RESIZE ==========
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const newNavbarHeight = navbar ? navbar.offsetHeight : 74;
            document.body.style.paddingTop = newNavbarHeight + 'px';
        }, 250);
    });
    
    // ========== 10. DETECTAR CUANDO EL MENÚ ESTÁ ABIERTO PARA BLOQUEAR SCROLL (OPCIONAL) ==========
    if (collapseElement) {
        collapseElement.addEventListener('show.bs.collapse', function() {
            document.body.style.overflow = 'hidden';
        });
        collapseElement.addEventListener('hide.bs.collapse', function() {
            document.body.style.overflow = '';
        });
    }
    
    // ========== 11. CARRUSELES DE TRATAMIENTOS (flechas + revelado en tap) ==========

    // 11a. Flechas de navegación: desplazan el track una "página" de tarjetas
    document.querySelectorAll('.tx-carousel').forEach(carousel => {
        const track = carousel.querySelector('.tx-track');
        const prevBtn = carousel.querySelector('.tx-arrow-prev');
        const nextBtn = carousel.querySelector('.tx-arrow-next');
        if (!track) return;

        const scrollByCards = (direction) => {
            const card = track.querySelector('.tx-card');
            const cardWidth = card ? card.getBoundingClientRect().width : 240;
            const gap = 22;
            track.scrollBy({ left: direction * (cardWidth + gap) * 2, behavior: 'smooth' });
        };

        if (prevBtn) prevBtn.addEventListener('click', () => scrollByCards(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => scrollByCards(1));
    });

    // 11a-bis. Si todas las tarjetas entran sin scroll, centrarlas y ocultar flechas/hint
    function ajustarCarruseles() {
        document.querySelectorAll('.tx-carousel').forEach(carousel => {
            const track = carousel.querySelector('.tx-track');
            if (!track) return;
            const section = carousel.closest('.category-section');
            // Medimos con las flechas ya ocultas temporalmente para no falsear el ancho
            const cabeSinScroll = track.scrollWidth <= carousel.clientWidth + 2;
            carousel.classList.toggle('is-static', cabeSinScroll);
            if (section) section.classList.toggle('is-static', cabeSinScroll);
        });
    }
    ajustarCarruseles();
    window.addEventListener('resize', ajustarCarruseles);
    // Recalcular cuando las fuentes/imágenes terminan de cargar (puede cambiar el ancho)
    window.addEventListener('load', ajustarCarruseles);

    // 11b. Revelado de descripción al tocar/tap (los dispositivos sin hover usan esto)
    document.querySelectorAll('.tx-card').forEach(card => {
        card.addEventListener('click', function(e) {
            const isTouch = window.matchMedia('(hover: none)').matches;
            if (!isTouch) return; // en desktop el :hover de CSS ya se encarga

            const alreadyOpen = card.classList.contains('is-open');

            // Cierra cualquier otra tarjeta abierta dentro del mismo carrusel
            const track = card.closest('.tx-track');
            if (track) {
                track.querySelectorAll('.tx-card.is-open').forEach(other => {
                    if (other !== card) other.classList.remove('is-open');
                });
            }

            card.classList.toggle('is-open', !alreadyOpen);
        });
    });

    // Cierra tarjetas abiertas si el usuario toca fuera de cualquier carrusel
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.tx-card')) {
            document.querySelectorAll('.tx-card.is-open').forEach(card => card.classList.remove('is-open'));
        }
    });

    // ========== 12. SELECTOR DE TECNOLOGÍA (chips + panel foto/info) ==========
    const techChips = document.querySelectorAll('.tech-chip');
    const techPanels = document.querySelectorAll('.tech-panel');

    function activateTechPanel(panelId) {
        techChips.forEach(chip => {
            const isMatch = chip.dataset.panel === panelId;
            chip.classList.toggle('is-active', isMatch);
            chip.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });
        techPanels.forEach(panel => {
            panel.classList.toggle('is-active', panel.id === `panel-${panelId}`);
        });
    }

    techChips.forEach(chip => {
        // Click o tap: selecciona el panel (funciona en touch y desktop)
        chip.addEventListener('click', () => activateTechPanel(chip.dataset.panel));
        // Hover: en desktop, apoyar el cursor también muestra el panel (pedido de la clienta)
        chip.addEventListener('mouseenter', () => activateTechPanel(chip.dataset.panel));
        // Teclado: Enter o Espacio activan el chip enfocado
        chip.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activateTechPanel(chip.dataset.panel);
            }
        });
    });

    console.log('✅ AURA | Script cargado correctamente - Menú responsive, scroll suave y funcionalidades activas');
});