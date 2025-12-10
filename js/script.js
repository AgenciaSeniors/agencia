document.addEventListener('DOMContentLoaded', () => {

  // 1. INICIALIZAR SCROLL FLUIDO (LENIS)
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Scroll suave para enlaces del menú
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      lenis.scrollTo(this.getAttribute('href'));
      
      const mobileMenu = document.getElementById('mobileMenu');
      const menuBtn = document.querySelector('.menu-btn');
      if (mobileMenu && mobileMenu.style.display === 'flex') {
        mobileMenu.style.display = 'none';
        menuBtn.innerHTML = '☰';
      }
    });
  });

  // 2. PRELOADER
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    if(preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.classList.add('hide');
        preloader.style.display = 'none'; 
      }, 500);
    }
  });

  // 3. MENÚ MÓVIL
  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.getElementById('mobileMenu');
  if(menuBtn) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.style.display === 'flex';
      mobileMenu.style.display = isOpen ? 'none' : 'flex';
      menuBtn.innerHTML = isOpen ? '✕' : '☰';
    });
  }

  // 4. ANIMACIÓN DE ENTRADA (REVEAL)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
  });

  // 5. MODALES DE SERVICIOS (Lógica Corregida)
  const modalContainer = document.getElementById('modal-container');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalBtn = document.querySelector('.btn-modal');
  const closeModalBtn = document.querySelector('.close-modal');

  // Textos persuasivos actualizados (Copywriting)
  const serviceDetails = {
    "DESARROLLO WEB": "No es solo una página, es tu mejor vendedor. Creamos sitios que cargan rápido en celulares (2G/3G), aparecen primero en Google y convencen a las visitas de comprar.",
    "MARKETING & ADS": "Deja de tirar dinero en volantes. Usamos segmentación avanzada en Facebook e Instagram para mostrar tus anuncios solo a personas que buscan lo que vendes.",
    "IDENTIDAD DE MARCA": "Tu imagen es lo primero que ven. Diseñamos logotipos y manuales de identidad que hacen que tu negocio se vea profesional, caro y confiable.",
    "AUTOMATIZACIÓN": "Ahorra horas de trabajo. Creamos programas que contestan mensajes automáticamente, organizan tus pedidos y actualizan tu inventario sin que tú muevas un dedo."
  };

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const titleElement = card.querySelector('h4');
      if(titleElement) {
        // CORRECCIÓN TÉCNICA: .trim() limpia los espacios invisibles del HTML
        // y .split('\n')[0] se asegura de ignorar el texto oculto del span si se colara.
        let title = titleElement.innerText.trim();
        
        // Limpieza extra por si acaso el navegador trae el texto oculto
        if(title.includes('\n')) {
            title = title.split('\n')[0].trim();
        }

        if(serviceDetails[title]){
          modalTitle.innerText = title;
          modalDesc.innerText = serviceDetails[title];
          if(modalBtn) modalBtn.href = `https://wa.me/5356621636?text=Hola,%20me%20interesa%20saber%20más%20sobre%20${encodeURIComponent(title)}.`;
          
          modalContainer.style.display = 'flex';
          requestAnimationFrame(() => {
             modalContainer.classList.add('show');
          });
          lenis.stop(); // Pausar scroll fondo
        }
      }
    });
  });

  const closeModal = () => {
    if(modalContainer) {
        modalContainer.classList.remove('show');
        setTimeout(() => { 
          modalContainer.style.display = 'none'; 
          lenis.start(); // Reactivar scroll fondo
        }, 300);
    }
  }

  if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target == modalContainer) closeModal();
  });

  // 6. FAQ ACORDEÓN
  document.querySelectorAll('.faq-item').forEach(faq => {
    const question = faq.querySelector('.faq-question');
    const answer = faq.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      faq.classList.toggle('active');
      if (faq.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = null;
      }
    });
  });

});