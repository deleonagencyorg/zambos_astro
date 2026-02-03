// Scripts para el Footer
(function() {
  function initFooter() {
    var footer = document.querySelector('footer');
    if (!footer) return;
    if (footer.dataset.footerScriptInitialized === 'true') return;
    footer.dataset.footerScriptInitialized = 'true';
    
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          footer.classList.add('footer-visible');
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(footer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
  } else {
    initFooter();
  }

  document.addEventListener('astro:page-load', initFooter);
  document.addEventListener('astro:after-swap', initFooter);
})();
