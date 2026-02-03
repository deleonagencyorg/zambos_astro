// Este archivo se ejecutará solo en el cliente
// Inicialización del carrusel con Swiper
(function() {
  var carouselInstance = null;

  function initCarousel() {
    var container = document.querySelector('.swiper-container.main-carousel');
    if (!container) return;

    if (container.dataset.carouselScriptInitialized === 'true' && carouselInstance) {
      carouselInstance.update();
      return;
    }

    if (carouselInstance) {
      carouselInstance.destroy(true, true);
      carouselInstance = null;
    }

    setTimeout(function() {
      try {
        carouselInstance = new Swiper('.swiper-container.main-carousel', {
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        });
        container.dataset.carouselScriptInitialized = 'true';
      } catch (error) {
        console.error('Error al inicializar Swiper:', error);
      }
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }

  document.addEventListener('astro:page-load', initCarousel);
  document.addEventListener('astro:after-swap', initCarousel);
})();
