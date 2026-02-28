// Mobile Menu Fix for Brands section
(function() {
  function initMobileMenuFix() {
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileMenuButton = document.getElementById('mobile-menu-button');
    var mobileMenuClose = document.getElementById('mobile-menu-close');
    
    if (!mobileMenu || !mobileMenuButton) return;
    if (mobileMenuButton.dataset.mobileMenuFixInitialized === 'true') return;
    mobileMenuButton.dataset.mobileMenuFixInitialized = 'true';

    mobileMenu.style.zIndex = '2147483647';
    
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      if (!mobileMenu.classList.contains('hidden')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      var isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      mobileMenuButton.setAttribute('aria-expanded', (!isExpanded).toString());
      
      var menuIconContainer = document.getElementById('menu-icon-container');
      if (menuIconContainer) {
        if (isExpanded) {
          menuIconContainer.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
        } else {
          menuIconContainer.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
        }
      }
    });
    
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
        
        if (mobileMenuButton) {
          mobileMenuButton.setAttribute('aria-expanded', 'false');
          var menuIconContainer = document.getElementById('menu-icon-container');
          if (menuIconContainer) {
            menuIconContainer.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
          }
        }
      });
    }
    
    var menuToggles = document.querySelectorAll('.menu-toggle');
    menuToggles.forEach(function(toggle) {
      if (toggle.dataset.toggleInitialized) return;
      toggle.dataset.toggleInitialized = 'true';
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        var parentDiv = toggle.closest('.w-full');
        var submenuContainer = parentDiv ? parentDiv.querySelector('.submenu-container') : null;
        
        if (submenuContainer) {
          submenuContainer.classList.toggle('hidden');
          var svg = toggle.querySelector('svg');
          if (svg) {
            if (submenuContainer.classList.contains('hidden')) {
              svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>';
            } else {
              svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>';
            }
          }
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenuFix);
  } else {
    initMobileMenuFix();
  }

  document.addEventListener('astro:page-load', initMobileMenuFix);
  document.addEventListener('astro:after-swap', initMobileMenuFix);
})();
