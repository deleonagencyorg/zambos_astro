// Scripts para el Header
(function() {
  function initHeaderScripts() {
    var menuButton = document.getElementById('mobile-menu-button');
    var mobileMenu = document.getElementById('mobile-menu');
    var menuIconContainer = document.getElementById('menu-icon-container');
    var siteHeader = document.getElementById('site-header');
    var mobileMenuClose = document.getElementById('mobile-menu-close');

    if (!menuButton || !mobileMenu) return;
    if (menuButton.dataset.headerScriptInitialized === 'true') return;
    menuButton.dataset.headerScriptInitialized = 'true';

    var menuIconSvg = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>';
    var closeIconSvg = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';

    var isMenuOpen = false;

    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
      mobileMenu.classList.toggle('hidden');
      menuButton.setAttribute('aria-expanded', String(isMenuOpen));
      
      if (menuIconContainer) {
        menuIconContainer.innerHTML = isMenuOpen ? closeIconSvg : menuIconSvg;
      }
      document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }

    menuButton.addEventListener('click', toggleMenu);
    
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', toggleMenu);
    }

    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        if (isMenuOpen) {
          menuButton.click();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderScripts);
  } else {
    initHeaderScripts();
  }

  document.addEventListener('astro:page-load', initHeaderScripts);
  document.addEventListener('astro:after-swap', initHeaderScripts);
})();
