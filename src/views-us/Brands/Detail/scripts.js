// Fix para las imágenes que no cargan
(function() {
  function initBrandDetail() {
    var container = document.querySelector('.brand-detail-container, .brands-container, main');
    if (!container) return;
    if (container.dataset.brandDetailInitialized === 'true') return;
    container.dataset.brandDetailInitialized = 'true';

    var images = document.querySelectorAll('img');
    images.forEach(function(img) {
      if (img.dataset.errorHandlerAttached) return;
      img.dataset.errorHandlerAttached = 'true';
      img.addEventListener('error', function() {
        this.src = '/images/brands/placeholder.jpg';
      });
    });
    
    var brandChips = document.querySelectorAll('.brand-chip');
    
    if (brandChips.length > 0) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, index) {
          if (entry.isIntersecting) {
            setTimeout(function() {
              entry.target.classList.add('animate-fade-in');
            }, index * 150);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      brandChips.forEach(function(chip) {
        observer.observe(chip);
      });
    }
    
    brandChips.forEach(function(chip) {
      if (chip.dataset.clickHandlerAttached) return;
      chip.dataset.clickHandlerAttached = 'true';
      chip.addEventListener('click', function() {
        var img = this.querySelector('img');
        if (img) {
          var modal = document.createElement('div');
          modal.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-75', 'flex', 'items-center', 'justify-center', 'z-50');
          
          var modalImg = document.createElement('img');
          modalImg.src = img.src;
          modalImg.classList.add('max-w-[90%]', 'max-h-[90vh]', 'object-contain');
          
          modal.appendChild(modalImg);
          document.body.appendChild(modal);
          
          modal.addEventListener('click', function() {
            document.body.removeChild(modal);
          });
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBrandDetail);
  } else {
    initBrandDetail();
  }

  document.addEventListener('astro:page-load', initBrandDetail);
  document.addEventListener('astro:after-swap', initBrandDetail);
})();
