// Función para manejar las animaciones de entrada
(function() {
  function initAnimations() {
    var animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatedElements.length) return;
    
    var observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    var observerCallback = function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var direction = entry.target.dataset.animateDirection || 'up';
          var delay = entry.target.dataset.animateDelay || '0';
          
          entry.target.classList.add('animate-in', 'animate-from-' + direction);
          entry.target.style.animationDelay = delay + 'ms';
          
          observer.unobserve(entry.target);
        }
      });
    };
    
    var observer = new IntersectionObserver(observerCallback, observerOptions);
    
    animatedElements.forEach(function(element) {
      if (element.dataset.animationObserved) return;
      element.dataset.animationObserved = 'true';
      observer.observe(element);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }

  document.addEventListener('astro:page-load', initAnimations);
  document.addEventListener('astro:after-swap', initAnimations);
})();
