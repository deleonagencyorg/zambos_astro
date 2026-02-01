const PRODUCTS_STATE_KEY = 'products:list:state';

function readStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat') || undefined;
  const countRaw = params.get('count') || undefined;
  const countNum = countRaw ? Number(countRaw) : undefined;
  return {
    cat,
    count: Number.isFinite(countNum) && countNum > 0 ? countNum : undefined,
  };
}

function readStateFromSession() {
  try {
    const raw = window.sessionStorage.getItem(PRODUCTS_STATE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return {
      cat: typeof parsed.cat === 'string' ? parsed.cat : undefined,
      count: typeof parsed.count === 'number' && Number.isFinite(parsed.count) && parsed.count > 0 ? parsed.count : undefined,
    };
  } catch {
    return {};
  }
}

function writeStateToSession(state) {
  try {
    window.sessionStorage.setItem(PRODUCTS_STATE_KEY, JSON.stringify(state));
  } catch {
    // noop
  }
}

function writeStateToUrl(state) {
  const url = new URL(window.location.href);
  if (state.cat && state.cat !== 'all') {
    url.searchParams.set('cat', state.cat);
  } else {
    url.searchParams.delete('cat');
  }
  if (state.count && state.count > 0) {
    url.searchParams.set('count', String(state.count));
  } else {
    url.searchParams.delete('count');
  }
  window.history.replaceState(window.history.state, '', url.toString());
}

function syncState(state) {
  writeStateToSession(state);
  writeStateToUrl(state);
}

function initProductsPage() {
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    img.addEventListener('error', function () {
      this.src = '/images/products/placeholder.jpg';
    });
  });

  const filterButtons = document.querySelectorAll('.category-filter');
  const productCards = document.querySelectorAll('.product-card');
  const loadMoreButton = document.getElementById('products-load-more');

  if (!filterButtons.length || !productCards.length) return;

  let currentCategory = 'all';
  let visibleCount = 0;

  function isMobile() {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  function isTablet() {
    return window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches;
  }

  function getInitialCount() {
    if (isMobile()) return 4;
    if (isTablet()) return 3;
    return 6;
  }

  function getPageSize() {
    return 6;
  }

  function setActiveCategoryButton(category) {
    filterButtons.forEach((btn) => {
      const btnCategory = btn.getAttribute('data-category') || 'all';
      btn.classList.toggle('active', btnCategory === category);
    });
  }

  function updateProductLinks() {
    const url = new URL(window.location.href);
    const cat = url.searchParams.get('cat');
    const count = url.searchParams.get('count');
    const qs = new URLSearchParams();
    if (cat) qs.set('cat', cat);
    if (count) qs.set('count', count);
    const query = qs.toString();
    if (!query) return;

    const links = document.querySelectorAll('#products-grid a[href]');
    links.forEach((linkEl) => {
      const href = linkEl.getAttribute('href');
      if (!href) return;
      if (href.includes('?')) return;
      linkEl.setAttribute('href', `${href}?${query}`);
    });
  }

  function updateProductsVisibility(resetAnimation) {
    const limit = visibleCount;
    let visibleIndex = 0;
    let shown = 0;
    let totalMatching = 0;

    productCards.forEach((cardEl) => {
      const matches = currentCategory === 'all' || cardEl.getAttribute('data-category') === currentCategory;

      if (matches) {
        totalMatching++;

        if (shown >= limit) {
          cardEl.style.display = 'none';
          return;
        }

        cardEl.style.display = 'block';
        if (resetAnimation) {
          cardEl.style.animation = 'none';
          cardEl.offsetHeight;
          cardEl.style.animation = 'fadeInUp 0.5s ease-out forwards';
        }
        cardEl.style.animationDelay = `${visibleIndex * 0.05}s`;
        visibleIndex++;
        shown++;
      } else {
        cardEl.style.display = 'none';
      }
    });

    if (loadMoreButton) {
      loadMoreButton.style.display = limit >= totalMatching ? 'none' : 'block';
    }

    syncState({ cat: currentCategory, count: visibleCount });
    updateProductLinks();
  }

  const urlState = readStateFromUrl();
  const sessionState = readStateFromSession();
  const initialCategory = urlState.cat || sessionState.cat || 'all';
  const initialCount = urlState.count || sessionState.count || getInitialCount();

  currentCategory = initialCategory;
  visibleCount = Math.max(getInitialCount(), initialCount);
  setActiveCategoryButton(currentCategory);
  updateProductsVisibility(false);

  filterButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      currentCategory = button.getAttribute('data-category') || 'all';
      visibleCount = getInitialCount();
      setActiveCategoryButton(currentCategory);
      updateProductsVisibility(true);
    });
  });

  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', (e) => {
      e.preventDefault();
      visibleCount += getPageSize();
      updateProductsVisibility(false);
    });
  }

  window.addEventListener('resize', () => {
    const minCount = getInitialCount();
    if (visibleCount < minCount) {
      visibleCount = minCount;
      updateProductsVisibility(false);
    }
  });
}

document.addEventListener('astro:page-load', initProductsPage);
