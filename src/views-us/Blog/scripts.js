// Fix para las imágenes que no cargan
(function() {
  function initBlogImages() {
    var images = document.querySelectorAll('img');
    images.forEach(function(img) {
      if (img.dataset.errorHandlerAttached) return;
      img.dataset.errorHandlerAttached = 'true';
      img.addEventListener('error', function() {
        this.src = '/images/news/placeholder.jpg';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogImages);
  } else {
    initBlogImages();
  }

  document.addEventListener('astro:page-load', initBlogImages);
  document.addEventListener('astro:after-swap', initBlogImages);
})();
