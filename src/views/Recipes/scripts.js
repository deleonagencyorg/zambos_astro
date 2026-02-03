// Fix para las imágenes que no cargan
(function() {
  function initRecipeImages() {
    var images = document.querySelectorAll('img');
    images.forEach(function(img) {
      if (img.dataset.errorHandlerAttached) return;
      img.dataset.errorHandlerAttached = 'true';
      img.addEventListener('error', function() {
        this.src = '/images/recipes/placeholder.jpg';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRecipeImages);
  } else {
    initRecipeImages();
  }

  document.addEventListener('astro:page-load', initRecipeImages);
  document.addEventListener('astro:after-swap', initRecipeImages);
})();
