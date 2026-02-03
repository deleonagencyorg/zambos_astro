// Breadcrumb component script
(function() {
  function initBreadcrumb() {
    var breadcrumbLinks = document.querySelectorAll('.breadcrumb-link');
    
    breadcrumbLinks.forEach(function(link) {
      if (link.classList.contains('current')) return;
      if (link.getAttribute('href') === window.location.pathname) {
        link.classList.add('current');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBreadcrumb);
  } else {
    initBreadcrumb();
  }

  document.addEventListener('astro:page-load', initBreadcrumb);
  document.addEventListener('astro:after-swap', initBreadcrumb);
})();
