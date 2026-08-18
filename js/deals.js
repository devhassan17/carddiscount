/* ============================================
   CardSaver.pk — Deals & Merchant Detail Module (Phase 5 Image Rendering Fix)
   Renders real CloudFront Logos & Cover Banners for all Peekaboo Deals
   ============================================ */

const Deals = {
  allDeals: null,
  activeFilters: {
    category: null,
    bank: null,
    city: null,
    search: '',
  },

  getAllDeals() {
    if (!this.allDeals) {
      this.allDeals = Data.getDeals();
    }
    return this.allDeals;
  },

  getFilteredDeals() {
    let deals = this.getAllDeals();
    const f = this.activeFilters;

    if (f.category) {
      deals = deals.filter(d => d.category === f.category);
    }
    if (f.bank) {
      deals = deals.filter(d => (d.banks || []).includes(f.bank));
    }
    if (f.city) {
      deals = deals.filter(d => (d.cities || []).includes(f.city));
    }
    if (f.search) {
      const q = f.search.toLowerCase();
      deals = deals.filter(d => 
        d.merchant.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }

    deals.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.discount - a.discount;
    });

    return deals;
  },

  isDealSaved(dealId) {
    const saved = Utils.storage.get('savedDeals') || [];
    return saved.includes(dealId);
  },

  toggleSaveDeal(dealId) {
    let saved = Utils.storage.get('savedDeals') || [];
    if (saved.includes(dealId)) {
      saved = saved.filter(id => id !== dealId);
      Utils.showToast('Removed', 'Deal removed from saved', 'info');
    } else {
      saved.push(dealId);
      Utils.showToast('Saved! ❤️', 'Deal saved for later', 'success');
    }
    Utils.storage.set('savedDeals', saved);
    return saved.includes(dealId);
  },

  // ── Render Deal Card (Fixed CloudFront Logos & Cover Banners) ──
  renderDealCard(deal) {
    const category = Data.getCategory(deal.category);
    const bankNames = (deal.banks || []).map(b => Data.getBank(b)?.name).filter(Boolean);
    const daysLeft = Utils.daysUntil(deal.validTo || '2026-12-31');

    const hasBanner = deal.banner && deal.banner.startsWith('http');
    const hasLogo = deal.logo && deal.logo.startsWith('http');

    return `
      <div class="deal-card hover-lift" data-deal-id="${deal.id}" onclick="App.navigateTo('#/deals/${deal.id}')">
        <div class="deal-card__hero" style="${hasBanner ? `background-image: url('${deal.banner}'); background-size: cover; background-position: center;` : `background: ${category?.bgColor || 'var(--fill-quaternary)'}`}">
          <div class="deal-card__hero-gradient" style="background: linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.2));"></div>
          
          ${hasLogo ? `
            <img src="${deal.logo}" class="deal-card__merchant-icon" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-md); box-shadow: var(--shadow-md); border: 2px solid #FFF; background: #000;" alt="${deal.merchant}">
          ` : `
            <div class="deal-card__merchant-icon" style="background: ${deal.merchantColor || '#007AFF'};">
              ${deal.merchantInitial || deal.merchant[0]}
            </div>
          `}
          
          <div class="deal-card__discount-badge">
            ${deal.discountType === 'bogo' ? 'BOGO' : `-${deal.discount}%`}
          </div>
        </div>
        <div class="deal-card__body">
          <div class="deal-card__merchant" onclick="event.stopPropagation(); App.navigateTo('#/merchant/${encodeURIComponent(deal.merchant)}')">
            ${Utils.escapeHtml(deal.merchant)} ↗
          </div>
          <div class="deal-card__description line-clamp-2">${Utils.escapeHtml(deal.description)}</div>
          <div class="deal-card__meta">
            ${(deal.banks || []).slice(0, 2).map(bankId => {
              const b = Data.getBank(bankId);
              return `
                <span class="deal-card__bank-tag">
                  <span class="deal-card__bank-dot" style="background: ${b?.color || '#007AFF'};"></span>
                  ${b?.name || bankId}
                </span>
              `;
            }).join('')}
            ${bankNames.length > 2 ? `<span class="deal-card__bank-tag">+${bankNames.length - 2}</span>` : ''}
            ${daysLeft <= 7 ? `<span class="deal-card__expiry">⏰ ${daysLeft}d left</span>` : ''}
          </div>
        </div>
      </div>
    `;
  },

  // ── Render Deal Card Horizontal (Fixed CloudFront Logos) ──
  renderDealCardH(deal) {
    const hasLogo = deal.logo && deal.logo.startsWith('http');
    return `
      <div class="deal-card-h hover-lift" data-deal-id="${deal.id}" onclick="App.navigateTo('#/deals/${deal.id}')">
        ${hasLogo ? `
          <img src="${deal.logo}" style="width: 56px; height: 56px; border-radius: var(--radius-md); object-fit: cover; flex-shrink: 0; background: #000; border: 1px solid var(--separator);" alt="${deal.merchant}">
        ` : `
          <div class="deal-card-h__icon" style="background: ${deal.merchantColor || '#007AFF'};">
            ${deal.merchantInitial || deal.merchant[0]}
          </div>
        `}
        <div class="deal-card-h__content">
          <div class="deal-card-h__title">${Utils.escapeHtml(deal.merchant)}</div>
          <div class="deal-card-h__subtitle">${(deal.banks || []).map(b => Data.getBank(b)?.name).filter(Boolean).join(', ')}</div>
        </div>
        <div class="deal-card-h__discount">
          ${deal.discountType === 'bogo' ? 'BOGO' : `${deal.discount}%`}
        </div>
      </div>
    `;
  },

  // ── Render Merchant Detail Page ──
  renderMerchantDetail(merchantName, currentTab = 'overview') {
    const decodedName = decodeURIComponent(merchantName);
    const m = Data.getMerchant(decodedName);
    const isFollowed = Data.isMerchantFollowed(decodedName);
    const merchantDeals = this.getAllDeals().filter(d => d.merchant.toLowerCase() === decodedName.toLowerCase());

    const hasLogo = m.logo && m.logo.startsWith('http');

    return `
      <div class="page-enter">
        <!-- Top App Header -->
        <div class="app-header">
          <button class="app-header__icon-btn" onclick="history.back()">
            ${Utils.getIcon('back', 20)}
          </button>
          <div class="app-header__title">${Utils.escapeHtml(m.name)}</div>
          <button class="app-header__icon-btn" onclick="Utils.showToast('Shared!', 'Link copied to clipboard', 'success');">
            ${Utils.getIcon('share', 18)}
          </button>
        </div>

        <!-- Merchant Header (Peekaboo Style) -->
        <div class="merchant-header">
          <div class="merchant-header__brand">
            ${hasLogo ? `
              <img src="${m.logo}" class="merchant-header__logo" style="width:64px;height:64px;object-fit:cover;border-radius:var(--radius-md);background:#000;" alt="${m.name}">
            ` : `
              <div class="merchant-header__logo">${m.name[0]}</div>
            `}
            <div class="merchant-header__title">${Utils.escapeHtml(m.name)}</div>
          </div>
          <div class="merchant-header__actions">
            <button class="btn ${isFollowed ? 'btn--secondary' : 'btn--primary'} btn--sm" id="follow-merchant-btn" data-merchant="${Utils.escapeHtml(m.name)}">
              ${isFollowed ? '❤️ Following' : '♡ Follow'}
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="peekaboo-nav-tabs">
          <button class="peekaboo-tab ${currentTab === 'overview' ? 'active' : ''}" onclick="Deals.switchMerchantTab('${Utils.escapeHtml(m.name)}', 'overview')">Overview</button>
          <button class="peekaboo-tab ${currentTab === 'offers' ? 'active' : ''}" onclick="Deals.switchMerchantTab('${Utils.escapeHtml(m.name)}', 'offers')">Card Offers (${merchantDeals.length})</button>
          <button class="peekaboo-tab ${currentTab === 'menu' ? 'active' : ''}" onclick="Deals.switchMerchantTab('${Utils.escapeHtml(m.name)}', 'menu')">Menu</button>
          <button class="peekaboo-tab ${currentTab === 'reviews' ? 'active' : ''}" onclick="Deals.switchMerchantTab('${Utils.escapeHtml(m.name)}', 'reviews')">Reviews (${m.reviewCount || 45})</button>
          <button class="peekaboo-tab ${currentTab === 'branches' ? 'active' : ''}" onclick="Deals.switchMerchantTab('${Utils.escapeHtml(m.name)}', 'branches')">Branches (${m.branchesCount || 3})</button>
        </div>

        <div style="padding: var(--space-5);">
          ${currentTab === 'overview' ? `
            <p style="font-size: var(--text-base); color: var(--text-secondary); line-height: var(--leading-relaxed); margin-bottom: var(--space-5);">
              ${Utils.escapeHtml(m.description)}
            </p>

            <div class="merchant-metrics-grid stagger-in">
              <div class="peekaboo-metric-card peekaboo-metric-card--blue">
                <div class="peekaboo-metric-card__value">💳 ${merchantDeals.length > 0 ? merchantDeals.length : m.dealsCount || 12}</div>
                <div class="peekaboo-metric-card__label">Deals by partners</div>
              </div>
              <div class="peekaboo-metric-card peekaboo-metric-card--red">
                <div class="peekaboo-metric-card__value">💬 ${m.rating || 4.2}</div>
                <div class="peekaboo-metric-card__label">Rated by ${m.reviewCount || 45} users</div>
              </div>
              <div class="peekaboo-metric-card peekaboo-metric-card--navy">
                <div class="peekaboo-metric-card__value">📍 ${m.branchesCount || 3}</div>
                <div class="peekaboo-metric-card__label">Branches in city</div>
              </div>
            </div>

            <div class="peekaboo-side-card">
              <div class="peekaboo-side-card__title">Call ${Utils.escapeHtml(m.name)}</div>
              <a href="tel:${m.phone || '111000786'}" style="text-decoration:none;">
                <div class="peekaboo-phone-box">
                  📞 ${m.phone || '111 000 786'}
                </div>
              </a>
            </div>

            <div class="peekaboo-side-card">
              <div class="peekaboo-side-card__title">Connect with ${Utils.escapeHtml(m.name)}</div>
              <div class="flex gap-3">
                ${m.social?.facebook ? `<a href="${m.social.facebook}" target="_blank" class="social-circle-btn social-circle-btn--facebook">f</a>` : ''}
                ${m.social?.instagram ? `<a href="${m.social.instagram}" target="_blank" class="social-circle-btn social-circle-btn--instagram">📸</a>` : ''}
                ${m.social?.website ? `<a href="${m.social.website}" target="_blank" class="social-circle-btn social-circle-btn--website">🌐</a>` : ''}
              </div>
            </div>
          ` : ''}

          ${currentTab === 'offers' ? `
            <div class="flex-col gap-3 stagger-in">
              ${merchantDeals.length === 0 ? `
                <div class="empty-state">
                  <div class="empty-state__icon">💳</div>
                  <div class="empty-state__title">No active deals found</div>
                </div>
              ` : merchantDeals.map(d => this.renderDealCardH(d)).join('')}
            </div>
          ` : ''}

          ${currentTab === 'menu' ? `
            <div class="stagger-in">
              <h3 style="margin-bottom: var(--space-4);">Menu & Specialties</h3>
              ${(m.menu || []).map(item => `
                <div class="menu-item-card">
                  <div class="flex gap-3 align-center">
                    <span style="font-size: 24px;">${item.image || '🍱'}</span>
                    <div>
                      <div class="menu-item-card__title">${Utils.escapeHtml(item.name)}</div>
                      <div class="text-xs text-secondary">${item.category}</div>
                    </div>
                  </div>
                  <div class="menu-item-card__price">${item.price}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${currentTab === 'reviews' ? `
            <div class="stagger-in">
              <div class="flex-between" style="margin-bottom: var(--space-4);">
                <h3>User Reviews ⭐ ${m.rating || 4.2}</h3>
                <button class="btn btn--primary btn--sm" id="add-review-btn">Write Review</button>
              </div>

              ${(m.reviews || []).map(rev => `
                <div class="review-card">
                  <div class="review-card__header">
                    <div class="font-semibold">${Utils.escapeHtml(rev.user)}</div>
                    <div class="review-card__stars">{"★".repeat(rev.rating)} (${rev.rating}/5)</div>
                  </div>
                  <p class="text-sm text-secondary" style="margin-bottom: var(--space-1);">${Utils.escapeHtml(rev.comment)}</p>
                  <div class="text-xs text-tertiary">${rev.date}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${currentTab === 'branches' ? `
            <div class="stagger-in">
              <h3 style="margin-bottom: var(--space-4);">Branches (${(m.branches || []).length})</h3>
              ${(m.branches || []).map(b => `
                <div class="card card--flat" style="padding: var(--space-4); margin-bottom: var(--space-3);">
                  <div class="font-semibold" style="margin-bottom: 2px;">📍 ${Utils.escapeHtml(b.name)}</div>
                  <div class="text-sm text-secondary" style="margin-bottom: var(--space-2);">${Utils.escapeHtml(b.address)}</div>
                  <a href="tel:${b.phone}" class="text-xs font-semibold" style="color: var(--accent-blue);">📞 ${b.phone}</a>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  switchMerchantTab(merchantName, tab) {
    const content = document.getElementById('page-content');
    if (content) {
      content.innerHTML = this.renderMerchantDetail(merchantName, tab);
      this.bindMerchantDetailEvents(merchantName);
    }
  },

  bindMerchantDetailEvents(merchantName) {
    document.getElementById('follow-merchant-btn')?.addEventListener('click', () => {
      Data.toggleFollowMerchant(merchantName);
      this.switchMerchantTab(merchantName, 'overview');
    });

    document.getElementById('add-review-btn')?.addEventListener('click', () => {
      const overlay = Utils.showModal(`
        <div class="modal__title">Write Review for ${Utils.escapeHtml(merchantName)}</div>
        <div class="flex-col gap-4">
          <div class="input-group">
            <label>Rating (1 to 5 stars)</label>
            <select class="input-field" id="review-rating">
              <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
              <option value="4">⭐⭐⭐⭐ (4/5)</option>
              <option value="3">⭐⭐⭐ (3/5)</option>
              <option value="2">⭐⭐ (2/5)</option>
              <option value="1">⭐ (1/5)</option>
            </select>
          </div>
          <div class="input-group">
            <label>Your Review</label>
            <textarea class="input-field" id="review-comment" rows="3" placeholder="Share your dining or discount experience..."></textarea>
          </div>
          <button class="btn btn--primary btn--full" id="submit-review-btn">Submit Review</button>
        </div>
      `);

      document.getElementById('submit-review-btn')?.addEventListener('click', () => {
        const rating = parseInt(document.getElementById('review-rating')?.value) || 5;
        const comment = document.getElementById('review-comment')?.value;
        const user = Auth.getCurrentUser();

        if (comment) {
          const m = Data.getMerchant(merchantName);
          m.reviews.unshift({
            user: user?.name || 'Anonymous User',
            rating: rating,
            date: 'Just now',
            comment: comment.trim()
          });
          m.reviewCount++;
          Utils.closeModal(overlay);
          Utils.showToast('Thank you! ⭐', 'Review posted successfully', 'success');
          this.switchMerchantTab(merchantName, 'reviews');
        }
      });
    });
  },

  renderDealDetail(dealId) {
    const deal = this.getAllDeals().find(d => d.id === dealId);
    if (!deal) return '<div class="empty-state"><div class="empty-state__title">Deal not found</div></div>';

    const category = Data.getCategory(deal.category);
    const userCards = Wallet.getCards();
    const userBanks = new Set(userCards.map(c => c.bank));
    const isSaved = this.isDealSaved(deal.id);
    const daysLeft = Utils.daysUntil(deal.validTo || '2026-12-31');

    const hasBanner = deal.banner && deal.banner.startsWith('http');
    const hasLogo = deal.logo && deal.logo.startsWith('http');

    return `
      <div class="deal-detail page-enter">
        <div class="app-header" style="position: absolute; top: 0; left: 0; right: 0; z-index: 10; background: transparent; border: none;">
          <button class="app-header__icon-btn" onclick="history.back()" style="background: rgba(0,0,0,0.3);">
            ${Utils.getIcon('back', 20)}
          </button>
          <button class="app-header__icon-btn save-deal-btn" data-deal-id="${deal.id}" style="background: rgba(0,0,0,0.3);">
            ${isSaved ? Utils.getIcon('heartFilled', 20) : Utils.getIcon('heart', 20)}
          </button>
        </div>

        <div class="deal-detail__hero" style="${hasBanner ? `background-image: url('${deal.banner}'); background-size: cover; background-position: center;` : `background: linear-gradient(135deg, ${deal.merchantColor || '#007AFF'}22, ${category?.bgColor || 'var(--bg-secondary)'});`}">
          <div class="deal-detail__hero-content" style="background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); padding: var(--space-5); border-radius: var(--radius-xl);">
            ${hasLogo ? `
              <img src="${deal.logo}" style="width: 72px; height: 72px; object-fit: cover; border-radius: var(--radius-lg); border: 2px solid white; margin: 0 auto var(--space-3);" alt="${deal.merchant}">
            ` : `
              <div class="deal-detail__merchant-icon" style="background: ${deal.merchantColor || '#007AFF'};">
                ${deal.merchantInitial || deal.merchant[0]}
              </div>
            `}
            <div class="deal-detail__discount">
              ${deal.discountType === 'bogo' ? 'BOGO' : `${deal.discount}%`} <span>${deal.discountType === 'bogo' ? '' : 'OFF'}</span>
            </div>
          </div>
        </div>

        <div class="deal-detail__body">
          <h2 class="deal-detail__merchant-name" onclick="App.navigateTo('#/merchant/${encodeURIComponent(deal.merchant)}')" style="cursor:pointer;">
            ${Utils.escapeHtml(deal.merchant)} ↗
          </h2>
          <div class="deal-detail__category-tag">
            ${category?.emoji || '🏷️'} ${category?.name || deal.category}
          </div>

          <p style="font-size: var(--text-base); color: var(--text-secondary); margin-bottom: var(--space-6); line-height: var(--leading-relaxed);">
            ${Utils.escapeHtml(deal.description)}
          </p>

          <div class="deal-detail__section">
            <div class="deal-detail__section-title">Eligible Banks</div>
            <div class="deal-detail__banks">
              ${(deal.banks || []).map(bankId => {
                const bank = Data.getBank(bankId);
                const isMatched = userBanks.has(bankId);
                return `
                  <div class="deal-detail__bank-badge ${isMatched ? 'matched' : ''}">
                    <span style="width:8px;height:8px;border-radius:50%;background:${bank?.color || '#00833D'};display:inline-block;"></span>
                    ${bank?.name || bankId}
                    ${isMatched ? ' ✓' : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="deal-detail__section">
            <div class="deal-detail__section-title">Available Cities</div>
            <div class="flex gap-2 flex-wrap">
              ${(deal.cities || []).map(c => `<span class="chip chip--sm">📍 ${c}</span>`).join('')}
            </div>
          </div>

          <div class="deal-detail__section">
            <div class="deal-detail__section-title">Terms & Conditions</div>
            <ul class="deal-detail__terms">
              ${(deal.terms || ['Present card at checkout']).map(t => `<li>${Utils.escapeHtml(t)}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="deal-detail__actions">
          <button class="btn btn--secondary btn--icon save-deal-btn" data-deal-id="${deal.id}" style="flex-shrink: 0; ${isSaved ? 'color: var(--accent-red);' : ''}">
            ${isSaved ? Utils.getIcon('heartFilled', 20) : Utils.getIcon('heart', 20)}
          </button>
          <button class="btn btn--primary btn--full" onclick="Utils.showToast('Shared!', 'Deal link copied to clipboard', 'success');">
            ${Utils.getIcon('share', 18)} Share Deal
          </button>
        </div>
      </div>
    `;
  },

  renderDealsPage() {
    const deals = this.getFilteredDeals();
    const f = this.activeFilters;

    return `
      <div class="page-enter">
        <div class="app-header">
          <div class="app-header__title">Deals</div>
          <button class="app-header__icon-btn" id="search-toggle-btn">
            ${Utils.getIcon('search', 20)}
          </button>
        </div>

        <div class="app-header__large-title">All Deals (${deals.length})</div>

        <div class="search-bar" id="deals-search-bar" style="margin-bottom: var(--space-3);">
          ${Utils.getIcon('search', 18)}
          <input type="text" placeholder="Search deals, Pizza Yumm's, Thaal Biryani..." 
            id="deals-search-input" value="${Utils.escapeHtml(f.search)}">
        </div>

        <div class="deals-page__filters">
          <div class="deals-page__filter-scroll">
            <button class="chip ${!f.category ? 'active' : ''}" data-filter="category" data-value="">All</button>
            ${Data.categories.map(c => `
              <button class="chip ${f.category === c.id ? 'active' : ''}" data-filter="category" data-value="${c.id}">
                ${c.emoji} ${c.name}
              </button>
            `).join('')}
          </div>
        </div>

        <div style="padding: 0 var(--space-5); margin-bottom: var(--space-3);">
          <span class="text-sm text-secondary">${deals.length} deals found</span>
        </div>

        ${deals.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state__icon">🔍</div>
            <div class="empty-state__title">No Deals Found</div>
            <div class="empty-state__text">Try adjusting your filters</div>
          </div>
        ` : `
          <div class="deals-page__grid stagger-in">
            ${deals.map(d => this.renderDealCard(d)).join('')}
          </div>
        `}

        <div style="height: var(--space-8);"></div>
      </div>
    `;
  },

  renderSearchPage() {
    const trending = this.getAllDeals().filter(d => d.trending).slice(0, 6);

    return `
      <div class="page-enter">
        <div class="app-header">
          <div class="app-header__title">Search</div>
        </div>

        <div style="padding: var(--space-4) var(--space-5);">
          <div class="search-bar">
            ${Utils.getIcon('search', 18)}
            <input type="text" placeholder="Search deals, Kababjees, Monal..." 
              id="global-search-input" autofocus>
          </div>
        </div>

        <div id="search-results"></div>

        <div id="search-default">
          <div class="section-header">
            <div class="section-header__title">🔥 Trending</div>
          </div>
          <div class="flex-col gap-3" style="padding: 0 var(--space-5);">
            ${trending.map(d => this.renderDealCardH(d)).join('')}
          </div>
        </div>
      </div>
    `;
  },

  bindDealEvents() {
    document.querySelectorAll('[data-filter]').forEach(chip => {
      chip.addEventListener('click', () => {
        const filter = chip.dataset.filter;
        const value = chip.dataset.value || null;
        this.activeFilters[filter] = value;
        App.render();
      });
    });

    const searchInput = document.getElementById('deals-search-input');
    if (searchInput) {
      const debouncedSearch = Utils.debounce((value) => {
        this.activeFilters.search = value;
        App.render();
      }, 300);

      searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
      });
    }

    document.querySelectorAll('.save-deal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const dealId = btn.dataset.dealId;
        this.toggleSaveDeal(dealId);
        App.render();
      });
    });

    document.getElementById('search-toggle-btn')?.addEventListener('click', () => {
      App.navigateTo('#/search');
    });
  }
};
