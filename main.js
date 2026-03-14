document.addEventListener("DOMContentLoaded", () => {
    
    // 1. ACORDEÓN (Preguntas Frecuentes)
    const faqBotones = document.querySelectorAll('.faq-pregunta');
    faqBotones.forEach(boton => {
        boton.addEventListener('click', function() {
            faqBotones.forEach(btn => {
                if(btn !== this) {
                    btn.classList.remove('activa');
                    btn.nextElementSibling.style.maxHeight = null;
                }
            });
            this.classList.toggle('activa');
            const respuesta = this.nextElementSibling;
            if (respuesta.style.maxHeight) {
                respuesta.style.maxHeight = null;
            } else {
                respuesta.style.maxHeight = respuesta.scrollHeight + "px";
            }
        });
    });

    // 2. MODALES
    const modalBtns = document.querySelectorAll('.open-modal');
    const closeBtns = document.querySelectorAll('.cerrar-modal');
    modalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if(modal) modal.style.display = "flex"; 
        });
    });
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal-oculto').style.display = "none";
        });
    });

    // Botón "Llenar Formulario" dentro del modal
    const botonesCerrarYBajar = document.querySelectorAll('.cerrar-y-bajar');
    botonesCerrarYBajar.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-oculto');
            if(modal) modal.style.display = "none";
        });
    });

    // 3. LIGHTBOX (Galería)
    const fotosGaleria = document.querySelectorAll('.lightbox-trigger');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('img01');
    const cerrarLightbox = document.querySelector('.cerrar-lightbox');
    fotosGaleria.forEach(foto => {
        foto.addEventListener('click', (e) => {
            e.preventDefault(); 
            const imgDentro = foto.querySelector('img');
            lightbox.style.display = "block";
            lightboxImg.src = imgDentro.src; 
        });
    });
    if(cerrarLightbox) {
        cerrarLightbox.addEventListener('click', () => {
            lightbox.style.display = "none";
        });
    }

    // Cerrar dando clic afuera
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-oculto')) e.target.style.display = "none";
        if (e.target.id === 'lightbox') lightbox.style.display = "none";
    });

    // 4. MOSTRAR/OCULTAR CAMPO DE FOTO EN EL FORMULARIO
    const servicioSelect = document.getElementById('servicioSelect');
    const inputAdjunto = document.getElementById('inputAdjunto');
    if (servicioSelect && inputAdjunto) {
        servicioSelect.addEventListener('change', function() {
            const servicio = this.value;
            if (servicio === 'Acrilicas' || servicio === 'Gelish' || servicio === 'Alaciado') {
                inputAdjunto.style.display = 'flex';
            } else {
                inputAdjunto.style.display = 'none';
            }
        });
    }

    // 5. ENVÍO DE FORMULARIO
    const formCita = document.getElementById('citaForm');
    const btnSubmitForm = document.querySelector('.btn-submit-form');
    if(formCita && btnSubmitForm) {
        formCita.addEventListener('submit', (e) => {
            e.preventDefault();
            const originalText = btnSubmitForm.textContent;
            btnSubmitForm.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
            btnSubmitForm.style.pointerEvents = 'none';

            fetch(formCita.action, {
                method: 'POST',
                body: new FormData(formCita),
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    btnSubmitForm.textContent = '¡Cita Solicitada!';
                    btnSubmitForm.style.background = '#25D366'; 
                    formCita.reset();
                    if(inputAdjunto) inputAdjunto.style.display = 'none';
                } else {
                    btnSubmitForm.textContent = 'Error al enviar';
                    btnSubmitForm.style.background = '#ff3333';
                }
            }).finally(() => {
                setTimeout(() => {
                    btnSubmitForm.textContent = originalText;
                    btnSubmitForm.style.background = '';
                    btnSubmitForm.style.pointerEvents = 'auto';
                }, 4000);
            });
        });
    }

    // 6. ANIMACIONES AL HACER SCROLL
    const revealElements = document.querySelectorAll('.reveal');
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    };
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));
});
