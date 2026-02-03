// Inicialización de AOS (Animate On Scroll)
import AOS from 'aos';
import 'aos/dist/aos.css';

(function() {
  function initAOS() {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      offset: 120,
      delay: 0,
      anchorPlacement: 'top-bottom',
      disable: window.innerWidth < 768 ? true : false,
    });
  }

  function refreshAOS() {
    AOS.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAOS);
  } else {
    initAOS();
  }

  document.addEventListener('astro:page-load', initAOS);
  document.addEventListener('astro:after-swap', refreshAOS);
})();
