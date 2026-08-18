/* ============================================
   CardSaver.pk — Main App Controller (Phase 8 Bank Logos & Categories)
   ============================================ */

const App = {
  currentRoute: '',

  init() {
    const theme = Utils.getTheme();
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    this.showSplash();
    window.addEventListener('hashchange', () => this.handleRoute());

    setTimeout(() => {
      this.hideSplash();
      this.handleRoute();
    }, 1800);
  },

  showSplash() {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.style.display = 'flex';
  },

  hideSplash() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.style.display = 'none';
      }, 600);
    }
  },

  handleRoute() {
    const hash = window.location.hash || '#/';
    this.currentRoute = hash;

    if (!Auth.isLoggedIn() && hash !== '#/auth') {
      if (!Auth.hasCompletedOnboarding()) {
        this.showOnboarding();
        return;
      }
      window.location.hash = '#/auth';
      return;
    }

    this.render();
  },

  navigateTo(hash) {
    window.location.hash = hash;
  },

  render() {
    const hash = window.location.hash || '#/';
    const pageContent = document.getElementById('page-content');
    const tabBar = document.getElementById('tab-bar');

    if (!pageContent) return;

    let content = '';
    let showTabs = true;
    let activeTab = '';

    if (hash === '#/auth' || hash === '#/auth/signup') {
      content = Auth.renderAuthPage(hash.includes('signup') ? 'signup' : 'signin');
      showTabs = false;
    } else if (hash === '#/' || hash === '#/home') {
      content = this.renderHomePage();
      activeTab = 'home';
    } else if (hash === '#/deals') {
      content = Deals.renderDealsPage();
      activeTab = 'deals';
    } else if (hash.startsWith('#/deals/')) {
      const dealId = hash.split('/').pop();
      content = Deals.renderDealDetail(dealId);
      showTabs = false;
    } else if (hash.startsWith('#/merchant/')) {
      const merchantName = hash.replace('#/merchant/', '');
      content = Deals.renderMerchantDetail(merchantName);
      showTabs = false;
    } else if (hash === '#/wallet') {
      content = Wallet.renderWalletPage();
      activeTab = 'wallet';
    } else if (hash === '#/groups') {
      content = Groups.renderGroupsPage();
      activeTab = 'groups';
    } else if (hash.startsWith('#/groups/')) {
      const groupId = hash.split('/').pop();
      content = Groups.renderGroupDetail(groupId);
      showTabs = false;
    } else if (hash === '#/profile') {
      content = Auth.renderProfilePage();
      activeTab = 'profile';
    } else if (hash === '#/notifications') {
      content = Notifications.renderNotificationsPage();
      showTabs = false;
    } else if (hash === '#/search') {
      content = Deals.renderSearchPage();
      showTabs = false;
    } else if (hash === '#/admin') {
      content = Admin.renderAdminPage();
      showTabs = false;
    } else {
      content = this.renderHomePage();
      activeTab = 'home';
    }

    pageContent.innerHTML = content;

    if (tabBar) {
      tabBar.style.display = showTabs ? 'flex' : 'none';
    }

    if (showTabs) {
      document.querySelectorAll('.tab-bar__item').forEach(item => {
        item.classList.toggle('active', item.dataset.tab === activeTab);
      });
    }

    this.bindEvents(hash);
    pageContent.scrollTop = 0;
    Notifications.updateBadge();
  },

  bindEvents(hash) {
    if (hash === '#/auth' || hash === '#/auth/signup') {
      Auth.bindAuthEvents();
    } else if (hash === '#/' || hash === '#/home') {
      this.bindHomeEvents();
    } else if (hash === '#/deals' || hash.startsWith('#/deals/')) {
      Deals.bindDealEvents();
    } else if (hash.startsWith('#/merchant/')) {
      const merchantName = hash.replace('#/merchant/', '');
      Deals.bindMerchantDetailEvents(decodeURIComponent(merchantName));
    } else if (hash === '#/wallet') {
      Wallet.bindWalletEvents();
    } else if (hash === '#/groups' || hash.startsWith('#/groups/')) {
      Groups.bindGroupEvents();
    } else if (hash === '#/profile') {
      Auth.bindProfileEvents();
      document.getElementById('admin-panel-cell')?.addEventListener('click', () => {
        App.navigateTo('#/admin');
      });
    } else if (hash === '#/notifications') {
      Notifications.bindNotificationEvents();
    } else if (hash === '#/search') {
      Deals.bindDealEvents();
    } else if (hash === '#/admin') {
      Admin.bindAdminEvents();
    }
  },

  renderHomePage() {
    const user = Auth.getCurrentUser();
    const cards = Wallet.getCards();
    const allDeals = Deals.getAllDeals();
    const matchingDeals = Data.getMatchingDeals(cards, allDeals);
    const trendingDeals = allDeals.filter(d => d.trending);
    const followedMerchants = Data.getFollowedMerchants();
    const unreadCount = Notifications.getUnreadCount();

    Notifications.generateDealAlerts();
    const greeting = this.getGreeting();

    return `
      <div class="page-enter">
        <!-- Header -->
        <div class="app-header">
          <div class="flex gap-3" style="align-items: center;">
            <div class="avatar avatar--sm" style="background: ${Utils.getAvatarColor(user?.name || 'User')};">
              ${Utils.getInitials(user?.name || 'U')}
            </div>
            <div>
              <div class="text-xs text-secondary">${greeting}</div>
              <div class="font-semibold">${Utils.escapeHtml(user?.name?.split(' ')[0] || 'User')}</div>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="app-header__icon-btn" onclick="App.navigateTo('#/search')">
              ${Utils.getIcon('search', 20)}
            </button>
            <button class="app-header__icon-btn" onclick="App.navigateTo('#/notifications')" style="position: relative;">
              ${Utils.getIcon('bell', 20)}
              <span class="badge" id="notification-badge" 
                style="position: absolute; top: -4px; right: -4px; ${unreadCount === 0 ? 'display: none;' : ''}">
                ${unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </button>
          </div>
        </div>

        <!-- Featured Merchant Showcase (Kababjees) -->
        <div style="padding: var(--space-3) var(--space-5);">
          <div class="hero-banner-card" style="background-image: url('assets/images/category_restaurants.png'); cursor: pointer;" onclick="App.navigateTo('#/merchant/Kababjees')">
            <div class="hero-banner-card__overlay">
              <div class="flex-between align-center" style="margin-bottom: var(--space-2);">
                <div class="badge" style="background: rgba(255,255,255,0.25); backdrop-filter: blur(10px); color: white;">
                  🔥 Featured Partner
                </div>
                <span style="color: white; font-size: 13px; font-weight: bold;">⭐ 3.8 (113 Reviews)</span>
              </div>
              <h2 style="color: white; font-size: var(--text-2xl); font-weight: 800; text-shadow: 0 2px 8px rgba(0,0,0,0.6);">
                Kababjees BBQ & Handi
              </h2>
              <p style="color: rgba(255,255,255,0.9); font-size: var(--text-sm); margin-top: 4px;">
                20% OFF on HBL, UBL & SadaPay • View Menu, Branches & Reviews ➔
              </p>
            </div>
          </div>
        </div>

        <!-- 🏷️ Peekaboo 10 Categories Carousel (Screenshot 1 Match) -->
        <div class="section-header">
          <div class="section-header__title">Explore Categories (${Data.categories.length})</div>
        </div>
        <div class="peekaboo-cat-scroll stagger-in">
          ${Data.categories.map(cat => `
            <div class="peekaboo-cat-card" onclick="Deals.activeFilters = { category: '${cat.id}' }; App.navigateTo('#/deals');">
              <img src="${cat.image}" class="peekaboo-cat-card__image" alt="${cat.name}">
              <div class="peekaboo-cat-card__body">
                <div class="peekaboo-cat-card__title">${cat.emoji} ${cat.name}</div>
                <div class="peekaboo-cat-card__places">${cat.placesCount}</div>
                <div class="peekaboo-cat-card__deals">${cat.dealsCount}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- 🏦 Partner Banks Grid (Screenshot 2 Match with Official Logos) -->
        <div class="section-header">
          <div class="section-header__title">Partner Banks & EMIs (${Data.banks.slice(0, 16).length})</div>
          <div class="section-header__action" onclick="App.navigateTo('#/wallet')">Add Card +</div>
        </div>
        <div class="bank-partner-grid stagger-in">
          ${Data.banks.slice(0, 16).map(b => `
            <div class="bank-partner-card" onclick="Deals.activeFilters = { bank: '${b.id}' }; App.navigateTo('#/deals');">
              ${Utils.getBankLogoHtml(b)}
              <div class="bank-partner-card__name">${Utils.escapeHtml(b.fullName)}</div>
            </div>
          `).join('')}
        </div>

        <!-- Following Merchants Bar (If any) -->
        ${followedMerchants.length > 0 ? `
          <div class="section-header">
            <div class="section-header__title">❤️ Following Brands</div>
          </div>
          <div class="scroll-h stagger-in" style="margin-bottom: var(--space-3);">
            ${followedMerchants.map(mName => `
              <div class="chip chip--sm active" onclick="App.navigateTo('#/merchant/${encodeURIComponent(mName)}')" style="padding: var(--space-2) var(--space-4);">
                ❤️ ${Utils.escapeHtml(mName)}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Matching Deals (If user has cards) -->
        ${cards.length > 0 && matchingDeals.length > 0 ? `
          <div class="section-header">
            <div class="section-header__title">💳 Deals Matching Your Cards (${matchingDeals.length})</div>
            <div class="section-header__action" onclick="App.navigateTo('#/deals')">See all →</div>
          </div>
          <div class="deals-scroll stagger-in">
            ${matchingDeals.slice(0, 10).map(d => Deals.renderDealCard(d)).join('')}
          </div>
        ` : cards.length === 0 ? `
          <div style="padding: 0 var(--space-5); margin-bottom: var(--space-4);">
            <div class="card card--glass" style="padding: var(--space-5); text-align: center;">
              <div style="font-size: 36px; margin-bottom: var(--space-2);">💳</div>
              <h3 style="margin-bottom: var(--space-2);">Add Your Cards & Digital Wallets</h3>
              <p style="font-size: var(--text-sm); margin-bottom: var(--space-4);">
                Add SadaPay, NayaPay, Easypaisa, HBL, UBL, MCB or Meezan to see personalized deals!
              </p>
              <button class="btn btn--primary btn--pill btn--sm" onclick="App.navigateTo('#/wallet')">
                + Add Card to Wallet
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Trending Deals Carousel (500+ Deals) -->
        <div class="section-header">
          <div class="section-header__title">🔥 Trending Discounts (${allDeals.length} Total)</div>
          <div class="section-header__action" onclick="App.navigateTo('#/deals')">See all →</div>
        </div>
        <div class="deals-scroll stagger-in">
          ${trendingDeals.slice(0, 15).map(d => Deals.renderDealCard(d)).join('')}
        </div>

        <div style="height: var(--space-6);"></div>
      </div>
    `;
  },

  bindHomeEvents() {
    Deals.bindDealEvents();
  },

  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    if (hour < 21) return 'Good Evening 🌅';
    return 'Good Night 🌙';
  },

  showOnboarding() {
    const pageContent = document.getElementById('page-content');
    const tabBar = document.getElementById('tab-bar');
    if (tabBar) tabBar.style.display = 'none';

    if (!pageContent) return;

    pageContent.innerHTML = `
      <div class="onboarding" id="onboarding">
        <div class="onboarding__slides">
          <div class="onboarding__slide active" data-slide="0">
            <div class="onboarding__slide-icon" style="background: linear-gradient(135deg, rgba(0,122,255,0.15), rgba(0,122,255,0.25));">
              🏷️
            </div>
            <h2 class="onboarding__slide-title">5,000+ Deals & 12,000+ Places</h2>
            <p class="onboarding__slide-text">
              Browse Kababjees, Monal, Khaadi & 100+ top Pakistani brands with menus, reviews & bank deals.
            </p>
          </div>
          <div class="onboarding__slide" data-slide="1">
            <div class="onboarding__slide-icon" style="background: linear-gradient(135deg, rgba(52,199,89,0.15), rgba(52,199,89,0.25));">
              💳
            </div>
            <h2 class="onboarding__slide-title">30+ Pakistani Banks</h2>
            <p class="onboarding__slide-text">
              Add HBL, UBL, Meezan, MCB, SadaPay, NayaPay, Easypaisa, JazzCash & all bank cards to unlock your discounts.
            </p>
          </div>
          <div class="onboarding__slide" data-slide="2">
            <div class="onboarding__slide-icon" style="background: linear-gradient(135deg, rgba(175,82,222,0.15), rgba(175,82,222,0.25));">
              👥
            </div>
            <h2 class="onboarding__slide-title">Save With Friends</h2>
            <p class="onboarding__slide-text">
              Create groups, pool cards with friends, and see all deals available to your collective wallet!
            </p>
          </div>
        </div>

        <div class="onboarding__footer">
          <div class="onboarding__dots">
            <div class="onboarding__dot active" data-dot="0"></div>
            <div class="onboarding__dot" data-dot="1"></div>
            <div class="onboarding__dot" data-dot="2"></div>
          </div>
          <button class="btn btn--primary btn--full btn--lg" id="onboarding-next">
            Continue
          </button>
          <button class="btn btn--ghost btn--full" id="onboarding-skip" style="margin-top: var(--space-2);">
            Skip
          </button>
        </div>
      </div>
    `;

    let currentSlide = 0;

    const updateSlide = (index) => {
      document.querySelectorAll('.onboarding__slide').forEach((slide, i) => {
        slide.classList.remove('active', 'prev');
        if (i === index) slide.classList.add('active');
        if (i < index) slide.classList.add('prev');
      });
      document.querySelectorAll('.onboarding__dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      
      if (index === 2) {
        document.getElementById('onboarding-next').textContent = 'Get Started';
      }
    };

    document.getElementById('onboarding-next')?.addEventListener('click', () => {
      if (currentSlide < 2) {
        currentSlide++;
        updateSlide(currentSlide);
      } else {
        Auth.completeOnboarding();
        window.location.hash = '#/auth';
        this.render();
      }
    });

    document.getElementById('onboarding-skip')?.addEventListener('click', () => {
      Auth.completeOnboarding();
      window.location.hash = '#/auth';
      this.render();
    });
  },
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
