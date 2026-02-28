// src/views/YummiesOne/scripts.js
(function() {
  function initYummiesOne() {
    var container = document.querySelector('.yummies-one-container, main');
    if (container && container.dataset.yummiesOneInitialized === 'true') return;
    if (container) container.dataset.yummiesOneInitialized = 'true';

    function smoothScroll(target) {
      var element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    var buttons = document.querySelectorAll('button');
    buttons.forEach(function(button) {
      if (button.dataset.yummiesClickAttached) return;
      button.dataset.yummiesClickAttached = 'true';
      button.addEventListener('click', function() {
        var text = this.textContent.trim();
        if (text === 'Saber Más') {
          smoothScroll('.features-section');
        }
      });
    });

    var featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(function(card) {
      if (card.dataset.hoverAttached) return;
      card.dataset.hoverAttached = 'true';
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
      });
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });

    var observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    var animatedElements = document.querySelectorAll('.feature-card, .hero-section, .cta-section');
    animatedElements.forEach(function(el) {
      if (el.dataset.animObserved) return;
      el.dataset.animObserved = 'true';
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initYummiesOne);
  } else {
    initYummiesOne();
  }

  document.addEventListener('astro:page-load', initYummiesOne);
  document.addEventListener('astro:after-swap', initYummiesOne);
})(); 