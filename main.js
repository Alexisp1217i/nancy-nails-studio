/* ============================================
   NANCY NAILS STUDIO — main.js (v2)
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ── 1. FAQ ACORDEÓN ── */
    const faqBotones = document.querySelectorAll('.faq-pregunta');
    faqBotones.forEach(boton => {
        boton.addEventListener('click', function () {
            const isActive = this.classList.contains('activa');
            // Cierra todos
            faqBotones.forEach(btn => {
                btn.classList.remove('activa');
                btn.setAttribute('aria-expanded', 'false');
                btn.nextElementSibling.style.maxHeight = null;
            });
            // Abre el actual si estaba cerrado
            if (!isActive) {
                this.classList.add('activa');
                this.setAttribute('aria-expanded', 'true');
                this.nextElementSibling.style.maxHeight = this.nextElementSibling.scrollHeight + 'px';
            }
        });
    });

    /* ── 2. MODALES ── */
    const openModal = (id) => {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.style.display = 'flex';
        // Pequeño delay para animación
        requestAnimationFrame(() => modal.classList.add('active'));
        document.body.style.overflow = 'hidden';
        // Focus trap: primer elemento focusable
        const focusable = modal.querySelector('button, a, input, select');
        if (focusable) focusable.focus();
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.style.display = 'none';
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.open-modal').forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.dataset.modal));
    });

    document.querySelectorAll('.cerrar-modal').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.closest('.modal-oculto')));
    });

    document.querySelectorAll('.cerrar-y-bajar').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.closest('.modal-oculto')));
    });

    // Cierra modal con clic fuera
    document.querySelectorAll('.modal-oculto').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    // Cierra con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-oculto').forEach(closeModal);
            closeLightbox();
        }
    });

    /* ── 3. LIGHTBOX con navegación ── */
    const galeria = [...document.querySelectorAll('.lightbox-trigger')];
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('img01');
    let currentIndex = 0;

    const openLightbox = (index) => {
        currentIndex = index;
        const img = galeria[index].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.style.display = 'flex';
        requestAnimationFrame(() => lightbox.classList.add('active'));
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.style.display = 'none';
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    galeria.forEach((foto, i) => {
        foto.addEventListener('click', () => openLightbox(i));
    });

    document.querySelector('.cerrar-lightbox')?.addEventListener('click', closeLightbox);
    document.getElementById('lb-prev')?.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galeria.length) % galeria.length;
        openLightbox(currentIndex);
    });
    document.getElementById('lb-next')?.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galeria.length;
        openLightbox(currentIndex);
    });
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Swipe en móvil para lightbox
    let touchStartX = 0;
    lightbox?.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox?.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            currentIndex = diff > 0
                ? (currentIndex + 1) % galeria.length
                : (currentIndex - 1 + galeria.length) % galeria.length;
            openLightbox(currentIndex);
        }
    });

    /* ── 4. MOSTRAR/OCULTAR CAMPO DE FOTO SEGÚN SERVICIO ── */
    const servicioSelect = document.getElementById('servicioSelect');
    const inputAdjunto = document.getElementById('inputAdjunto');
    const serviciosConFoto = new Set(['Acrilicas', 'Gelish', 'Alaciado']);

    servicioSelect?.addEventListener('change', function () {
        const mostrar = serviciosConFoto.has(this.value);
        inputAdjunto.style.display = mostrar ? 'flex' : 'none';
        // Limpia el input si se oculta
        if (!mostrar) inputAdjunto.querySelector('input[type="file"]').value = '';
    });

    /* ── 5. ENVÍO DE FORMULARIO ── */
    const formCita = document.getElementById('citaForm');
    const btnSubmit = formCita?.querySelector('.btn-submit-form');

    formCita?.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validación básica de teléfono
        const telefono = formCita.querySelector('[name="telefono"]').value.replace(/\D/g, '');
        if (telefono.length !== 10) {
            showToast('⚠️ Ingresa un número de WhatsApp de 10 dígitos.', 'error');
            return;
        }

        const originalHTML = btnSubmit.innerHTML;
        btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
        btnSubmit.disabled = true;

        try {
            const response = await fetch(formCita.action, {
                method: 'POST',
                body: new FormData(formCita),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showToast('✅ ¡Cita solicitada con éxito! Te contactaremos pronto.', 'success');
                formCita.reset();
                if (inputAdjunto) inputAdjunto.style.display = 'none';
            } else {
                throw new Error('Error del servidor');
            }
        } catch {
            showToast('❌ Hubo un error. Contáctanos por WhatsApp.', 'error');
        } finally {
            setTimeout(() => {
                btnSubmit.innerHTML = originalHTML;
                btnSubmit.disabled = false;
            }, 3500);
        }
    });

    /* ── 6. TOAST NOTIFICATIONS ── */
    function showToast(mensaje, tipo = 'success') {
        const existente = document.querySelector('.toast');
        existente?.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = mensaje;
        toast.style.cssText = `
            position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
            background: ${tipo === 'success' ? '#25D366' : '#e53935'};
            color: white; padding: 14px 28px; border-radius: 50px;
            font-weight: 600; font-size: 0.92rem; z-index: 9999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            animation: slideUpFade 0.4s ease;
            max-width: 90vw; text-align: center;
        `;
        document.body.appendChild(toast);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUpFade {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.4s';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    /* ── 7. SCROLL REVEAL ── */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ── 8. FECHA MÍNIMA EN EL FORMULARIO (hoy) ── */
    const fechaInput = document.getElementById('fecha_deseada');
    if (fechaInput) {
        const hoy = new Date();
        // Agregar un día mínimo (mañana)
        hoy.setDate(hoy.getDate() + 1);
        fechaInput.min = hoy.toISOString().split('T')[0];
    }

});
