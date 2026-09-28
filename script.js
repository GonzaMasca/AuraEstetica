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

    function activateTechPanel(panelId, fromClick) {
        techChips.forEach(chip => {
            const isMatch = chip.dataset.panel === panelId;
            chip.classList.toggle('is-active', isMatch);
            chip.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });
        techPanels.forEach(panel => {
            panel.classList.toggle('is-active', panel.id === `panel-${panelId}`);
        });

        // En móvil: scrollear al panel para que se vea la foto sin tener que bajar
        if (fromClick && window.innerWidth <= 980) {
            const stage = document.querySelector('.tech-stage');
            if (stage) {
                setTimeout(() => {
                    stage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 80);
            }
        }
    }

    techChips.forEach(chip => {
        // Click o tap: selecciona el panel y scrollea en móvil
        chip.addEventListener('click', () => activateTechPanel(chip.dataset.panel, true));
        // Hover: solo en desktop (no scrollea)
        chip.addEventListener('mouseenter', () => activateTechPanel(chip.dataset.panel, false));
        // Teclado: Enter o Espacio
        chip.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activateTechPanel(chip.dataset.panel, true);
            }
        });
    });

    // ========== 13. BOTÓN FLOTANTE DE CONTACTOS (Speed Dial) ==========
    const fabContainer = document.getElementById('fabContacto');
    const fabTrigger = document.getElementById('fabTrigger');

    if (fabTrigger && fabContainer) {
        // Toggle al hacer click
        fabTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            fabContainer.classList.toggle('is-open');
        });

        // Cerrar al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.fab-container')) {
                fabContainer.classList.remove('is-open');
            }
        });

        // Cerrar al hacer scroll (el usuario se fue a otra parte)
        let fabScrollTimer;
        window.addEventListener('scroll', function() {
            if (fabContainer.classList.contains('is-open')) {
                clearTimeout(fabScrollTimer);
                fabScrollTimer = setTimeout(function() {
                    fabContainer.classList.remove('is-open');
                }, 800);
            }
        });
    }

    // ========== 14. EFECTO SCROLL: títulos y elementos aparecen gradualmente ==========
    
    // Seleccionar los elementos que se van a animar
    const scrollElements = [];
    
    // Títulos de sección (los más notorios)
    document.querySelectorAll('.section-header h2, .category-title h3, .tech h2, .contact-info h2').forEach(el => {
        scrollElements.push({ el, type: 'title' });
    });
    
    // Subtítulos y tags
    document.querySelectorAll('.section-header p, .section-tag, .category-divider').forEach(el => {
        scrollElements.push({ el, type: 'subtitle' });
    });
    
    // Bloques grandes
    document.querySelectorAll('.about-text, .about-visual, .tx-carousel, .tech-chips, .tech-stage, .contact-buttons, .contact-map').forEach(el => {
        scrollElements.push({ el, type: 'block' });
    });

    // Aplicar estilo inicial: todo transparente
    scrollElements.forEach(item => {
        item.el.style.opacity = '0';
        item.el.style.transform = item.type === 'title' ? 'translateY(30px)' : 'translateY(18px)';
        item.el.style.transition = 'none'; // sin transición al inicio
    });

    // Forzar repaint para que el estado inicial se aplique
    document.body.offsetHeight;

    // Ahora activar transiciones
    setTimeout(() => {
        scrollElements.forEach(item => {
            item.el.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';
        });
    }, 50);

    function actualizarScroll() {
        const windowH = window.innerHeight;

        scrollElements.forEach(item => {
            const rect = item.el.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;

            // Zona de activación: desde el 95% del viewport hasta el 40%
            // (el elemento va apareciendo a medida que sube en la pantalla)
            const startPoint = windowH * 0.95;  // empieza a aparecer (abajo)
            const endPoint = windowH * 0.45;    // totalmente visible (centro-alto)

            if (elementCenter >= startPoint) {
                // Todavía no llegó: invisible
                item.el.style.opacity = '0';
                item.el.style.transform = item.type === 'title' ? 'translateY(30px)' : 'translateY(18px)';
            } else if (elementCenter <= endPoint) {
                // Ya pasó la zona: totalmente visible
                item.el.style.opacity = '1';
                item.el.style.transform = 'translateY(0)';
            } else {
                // En la zona de transición: calcular progreso
                const progress = 1 - (elementCenter - endPoint) / (startPoint - endPoint);
                const clamped = Math.max(0, Math.min(1, progress));
                // Curva suave (ease-out)
                const eased = 1 - Math.pow(1 - clamped, 2.5);
                
                item.el.style.opacity = eased.toFixed(3);
                const yOffset = item.type === 'title' ? (1 - eased) * 30 : (1 - eased) * 18;
                item.el.style.transform = `translateY(${yOffset.toFixed(1)}px)`;
            }
        });
    }

    // Ejecutar en cada frame de scroll (con requestAnimationFrame para rendimiento)
    let scrollTicking = false;
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            requestAnimationFrame(function() {
                actualizarScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // Ejecutar al cargar (por si ya hay elementos visibles)
    actualizarScroll();

    // Respetar preferencia de reducir movimiento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        scrollElements.forEach(item => {
            item.el.style.opacity = '1';
            item.el.style.transform = 'none';
            item.el.style.transition = 'none';
        });
    }

    console.log('✅ AURA | Script cargado correctamente - Menú responsive, scroll suave y funcionalidades activas');
});

// ====================================================================
// HERO 1B — "Mármol vivo": inclinación 3D, brillo que barre,
// marco que se dibuja y botón magnético.
// Pegá esto al final de tu script.js (dentro o fuera del DOMContentLoaded).
// ====================================================================
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const hero = document.querySelector('[data-hero-tilt]');
        if (!hero) return;

        // Solo se desactiva en pantallas táctiles (sin cursor).
        // Nota: NO se desactiva con "reducir movimiento" porque el efecto
        // lo controla el propio cursor; solo se atenúa.
        if (window.matchMedia('(hover: none)').matches) return;
        const soft = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.5 : 1;

        const magnets = hero.querySelectorAll('[data-hero-magnet]');
        const MAX_TILT_X = 5 * soft;   // grados (vertical)
        const MAX_TILT_Y = 6 * soft;   // grados (horizontal)
        const REACH = 260;      // px de alcance del imán del botón
        const PULL = 0.14;      // fuerza del imán

        let raf = null, pos = null;

        function apply() {
            raf = null;
            if (!pos) return;
            const { x, y, w, h } = pos;
            const nx = (x / w) * 2 - 1;
            const ny = (y / h) * 2 - 1;

            hero.style.setProperty('--hero-tx', (-ny * MAX_TILT_X).toFixed(2) + 'deg');
            hero.style.setProperty('--hero-ty', (nx * MAX_TILT_Y).toFixed(2) + 'deg');
            hero.style.setProperty('--hero-sheen', (15 + (x / w) * 70).toFixed(1) + '%');

            magnets.forEach(function (m) {
                const r = m.getBoundingClientRect();
                const hr = hero.getBoundingClientRect();
                const cx = r.left - hr.left + r.width / 2;
                const cy = r.top - hr.top + r.height / 2;
                const dx = x - cx, dy = y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const f = dist < REACH ? (1 - dist / REACH) : 0;
                m.style.transform = 'translate(' + (dx * PULL * f).toFixed(2) + 'px,' +
                                                  (dy * PULL * f - 3 * f).toFixed(2) + 'px)';
            });
        }

        hero.addEventListener('mousemove', function (e) {
            const r = hero.getBoundingClientRect();
            pos = { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
            if (!raf) raf = requestAnimationFrame(apply);
        });

        hero.addEventListener('mouseenter', function () {
            hero.classList.add('is-hover');
        });

        hero.addEventListener('mouseleave', function () {
            hero.classList.remove('is-hover');
            hero.style.setProperty('--hero-tx', '0deg');
            hero.style.setProperty('--hero-ty', '0deg');
            hero.style.setProperty('--hero-sheen', '50%');
            magnets.forEach(function (m) { m.style.transform = 'translate(0,0)'; });
        });

        // Destello del botón al pasar el cursor
        magnets.forEach(function (m) {
            const sheen = m.querySelector('.btn-hero-sheen');
            if (!sheen) return;
            m.addEventListener('mouseenter', function () {
                sheen.style.animation = 'none';
                void sheen.offsetWidth;             // reinicia la animación
                sheen.style.animation = 'aura-sheen 900ms ease-out';
            });
        });
    });
})();

// ====================================================================
// CARRUSEL de la sección NOSOTROS — pase automático cada 5 s
// Crossfade + Ken Burns (zoom lento) + destello dorado. Sin controles.
// ====================================================================
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const car = document.querySelector('[data-about-carousel]');
        if (!car) return;

        const slides = Array.from(car.querySelectorAll('.av-slide'));
        if (slides.length < 2) return;

        const DELAY = 2500;   // milisegundos entre fotos
        let index = 0;
        let timer = null;

        // Capa del destello dorado que barre en cada cambio
        const sweep = document.createElement('div');
        sweep.className = 'av-sweep';
        car.appendChild(sweep);

        function replay(el, cls) {
            el.classList.remove(cls);
            void el.offsetWidth;      // reinicia la animación CSS
            el.classList.add(cls);
        }

        function go(n) {
            index = (n + slides.length) % slides.length;
            slides.forEach(function (s, i) {
                s.classList.remove('is-active');
                if (i === index) { void s.offsetWidth; s.classList.add('is-active'); }
            });
            replay(sweep, 'is-run');
            restart();
        }

        function restart() {
            clearInterval(timer);
            timer = setInterval(function () { go(index + 1); }, DELAY);
        }

        // No consumir el temporizador con la pestaña oculta
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) clearInterval(timer); else restart();
        });

        restart();
    });
})();
