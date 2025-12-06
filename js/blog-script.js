document.addEventListener('DOMContentLoaded', () => {
  // 1. SCROLL SUAVE (LENIS) - Configuración Básica
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 2. MENÚ MÓVIL (Funciona igual que en la home)
  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if(menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.style.display === 'flex';
      mobileMenu.style.display = isOpen ? 'none' : 'flex';
      menuBtn.innerHTML = isOpen ? '✕' : '☰';
      
      // Si abres el menú, pausa el scroll de fondo
      if (isOpen) lenis.start();
      else lenis.stop();
    });
  }
});