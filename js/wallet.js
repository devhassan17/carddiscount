/* ============================================
   CardSaver.pk — Card Wallet Module (Phase 2)
   Support for 30+ Banks & Digital Wallets + Card Tiers
   ============================================ */

const Wallet = {
  // ── Get all cards ──
  getCards() {
    return Utils.storage.get('cards') || [];
  },

  // ── Add card ──
  addCard(cardData) {
    const cards = this.getCards();
    const card = {
      id: Utils.generateId(),
      bank: cardData.bank,
      type: cardData.type,
      tier: cardData.tier || 'Classic',
      network: cardData.network,
      last4: cardData.last4,
      nickname: cardData.nickname || '',
      addedAt: new Date().toISOString(),
    };

    cards.push(card);
    Utils.storage.set('cards', cards);

    // Notification
    const bank = Data.getBank(card.bank);
    Notifications.add({
      type: 'card_added',
      title: 'Card Added! 💳',
      body: `Your ${bank?.name || 'Bank'} ${card.tier} ${card.type} has been added to your wallet.`,
      icon: '💳'
    });

    return card;
  },

  // ── Remove card ──
  removeCard(cardId) {
    let cards = this.getCards();
    cards = cards.filter(c => c.id !== cardId);
    Utils.storage.set('cards', cards);
    return cards;
  },

  // ── Render Wallet Page ──
  renderWalletPage() {
    const cards = this.getCards();
    const allDeals = Data.getDeals();
    const matchingDeals = Data.getMatchingDeals(cards, allDeals);
    const user = Auth.getCurrentUser();

    return `
      <div class="page-enter">
        <div class="app-header">
          <div class="app-header__title">My Wallet</div>
          <button class="app-header__icon-btn" id="add-card-btn">
            ${Utils.getIcon('plus', 20)}
          </button>
        </div>

        <div class="app-header__large-title">My Cards</div>

        ${cards.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state__icon">💳</div>
            <div class="empty-state__title">No Cards Yet</div>
            <div class="empty-state__text">Add your bank cards, SadaPay, NayaPay, Easypaisa or JazzCash to discover personalized deals.</div>
            <button class="btn btn--primary btn--pill" id="add-card-empty">
              ${Utils.getIcon('plus', 18)} Add Your First Card
            </button>
          </div>
        ` : `
          <div class="wallet-page__stats stagger-in">
            <div class="stat-card">
              <div class="stat-card__value">${cards.length}</div>
              <div class="stat-card__label">Cards</div>
            </div>
            <div class="stat-card">
              <div class="stat-card__value">${matchingDeals.length}</div>
              <div class="stat-card__label">Matching Deals</div>
            </div>
            <div class="stat-card">
              <div class="stat-card__value">${new Set(cards.map(c => c.bank)).size}</div>
              <div class="stat-card__label">Banks / Wallets</div>
            </div>
          </div>

          <div class="wallet-page__cards stagger-in">
            ${cards.map(card => {
              const bank = Data.getBank(card.bank);
              const tier = Data.getTier(card.tier) || { name: card.tier || 'Classic', badgeColor: '#8E8E93' };
              const cardDeals = allDeals.filter(d => 
                d.banks.includes(card.bank) && 
                d.cardTypes.includes(card.type) &&
                (!d.tiers || d.tiers.includes(card.tier || 'Classic'))
              );
              return `
                <div class="wallet-page__card-wrapper">
                  <div class="bank-card bank-card--${bank?.cssClass || 'hbl'}" data-card-id="${card.id}">
                    <div class="bank-card__header">
                      <div>
                        <div class="bank-card__bank-name">${bank?.name || 'Bank'}</div>
                        <span class="card-tier-badge" style="background: ${tier.badgeColor}; color: ${card.tier === 'Gold' || card.tier === 'Platinum' || card.tier === 'Silver' ? '#000' : '#FFF'}">
                          ${card.tier || 'Classic'}
                        </span>
                      </div>
                      <div class="bank-card__chip"></div>
                    </div>
                    <div class="bank-card__number">•••• •••• •••• ${card.last4}</div>
                    <div class="bank-card__footer">
                      <div>
                        <div class="bank-card__name">${Utils.escapeHtml(card.nickname || user?.name || 'Cardholder')}</div>
                        <div class="bank-card__type">${card.type}</div>
                      </div>
                      <div class="bank-card__network">${card.network}</div>
                    </div>
                  </div>
                  <div class="flex-between" style="padding: var(--space-3) var(--space-2);">
                    <span class="text-sm text-secondary">${cardDeals.length} active deals</span>
                    <button class="btn btn--ghost btn--sm delete-card-btn" data-card-id="${card.id}" style="color: var(--accent-red);">
                      ${Utils.getIcon('trash', 16)} Remove
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  },

  // ── Show Add Card Modal ──
  showAddCardModal() {
    // Group banks by type
    const commercial = Data.banks.filter(b => b.type === 'commercial');
    const digital = Data.banks.filter(b => b.type === 'digital');
    const publicSector = Data.banks.filter(b => b.type === 'public');
    const microfinance = Data.banks.filter(b => b.type === 'microfinance');

    const overlay = Utils.showModal(`
      <div class="modal__title">Add New Card / Wallet</div>
      <div class="flex-col gap-4">
        <div class="input-group">
          <label>Bank or Digital Wallet (30+ Options)</label>
          <select class="input-field" id="card-bank">
            <option value="">Select institution</option>
            <optgroup label="⚡ Digital Wallets & EMIs">
              ${digital.map(b => `<option value="${b.id}">${b.fullName}</option>`).join('')}
            </optgroup>
            <optgroup label="🏦 Commercial Banks">
              ${commercial.map(b => `<option value="${b.id}">${b.fullName}</option>`).join('')}
            </optgroup>
            <optgroup label="🏛️ Public Sector Banks">
              ${publicSector.map(b => `<option value="${b.id}">${b.fullName}</option>`).join('')}
            </optgroup>
            <optgroup label="🌱 Microfinance Banks">
              ${microfinance.map(b => `<option value="${b.id}">${b.fullName}</option>`).join('')}
            </optgroup>
          </select>
        </div>

        <div class="input-group">
          <label>Card Category / Tier</label>
          <select class="input-field" id="card-tier">
            ${Data.cardTiers.map(t => `<option value="${t.id}" ${t.id === 'Gold' ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>
        </div>

        <div class="input-group">
          <label>Card Type</label>
          <select class="input-field" id="card-type">
            ${Data.cardTypes.map(t => `<option value="${t}">${t}</option>`).join('')}
          </select>
        </div>

        <div class="input-group">
          <label>Payment Network</label>
          <select class="input-field" id="card-network">
            ${Data.cardNetworks.map(n => `<option value="${n}">${n}</option>`).join('')}
          </select>
        </div>

        <div class="input-group">
          <label>Last 4 Digits</label>
          <input type="text" class="input-field" id="card-last4" 
            placeholder="1234" maxlength="4" pattern="[0-9]*" inputmode="numeric">
        </div>

        <div class="input-group">
          <label>Nickname (Optional)</label>
          <input type="text" class="input-field" id="card-nickname" 
            placeholder="e.g., My HBL Platinum / SadaPay Black">
        </div>

        <div id="card-preview" style="margin: var(--space-2) 0;"></div>

        <button class="btn btn--primary btn--full" id="save-card-btn">Add Card to Wallet</button>
      </div>
    `);

    // Live card preview
    const updatePreview = () => {
      const bank = document.getElementById('card-bank')?.value;
      const tier = document.getElementById('card-tier')?.value || 'Gold';
      const type = document.getElementById('card-type')?.value;
      const network = document.getElementById('card-network')?.value;
      const last4 = document.getElementById('card-last4')?.value || '••••';
      const nickname = document.getElementById('card-nickname')?.value;
      const preview = document.getElementById('card-preview');

      if (bank && preview) {
        const bankData = Data.getBank(bank);
        const tierData = Data.getTier(tier);
        preview.innerHTML = `
          <div class="bank-card bank-card--${bankData?.cssClass || 'hbl'}" style="max-width: 320px; margin: 0 auto; font-size: 0.85em;">
            <div class="bank-card__header">
              <div>
                <div class="bank-card__bank-name">${bankData?.name || ''}</div>
                <span class="card-tier-badge" style="background: ${tierData?.badgeColor || '#8E8E93'}; color: ${tier === 'Gold' || tier === 'Platinum' || tier === 'Silver' ? '#000' : '#FFF'}">
                  ${tier}
                </span>
              </div>
              <div class="bank-card__chip"></div>
            </div>
            <div class="bank-card__number">•••• •••• •••• ${Utils.escapeHtml(last4)}</div>
            <div class="bank-card__footer">
              <div>
                <div class="bank-card__name">${Utils.escapeHtml(nickname || Auth.getCurrentUser()?.name || '')}</div>
                <div class="bank-card__type">${type || ''}</div>
              </div>
              <div class="bank-card__network">${network || ''}</div>
            </div>
          </div>
        `;
      }
    };

    ['card-bank', 'card-tier', 'card-type', 'card-network', 'card-last4', 'card-nickname'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', updatePreview);
      document.getElementById(id)?.addEventListener('change', updatePreview);
    });

    document.getElementById('save-card-btn')?.addEventListener('click', () => {
      const bank = document.getElementById('card-bank')?.value;
      const tier = document.getElementById('card-tier')?.value;
      const type = document.getElementById('card-type')?.value;
      const network = document.getElementById('card-network')?.value;
      const last4 = document.getElementById('card-last4')?.value;
      const nickname = document.getElementById('card-nickname')?.value;

      if (!bank || !type || !network || !last4) {
        Utils.showToast('Missing Fields', 'Please select bank and fill last 4 digits', 'warning');
        return;
      }

      if (last4.length !== 4 || !/^\d{4}$/.test(last4)) {
        Utils.showToast('Invalid', 'Last 4 digits must be numeric', 'error');
        return;
      }

      Wallet.addCard({ bank, tier, type, network, last4, nickname });
      Utils.closeModal(overlay);
      Utils.showToast('Card Added! 💳', 'Added to your wallet', 'success');
      App.render();
    });
  },

  // ── Bind Wallet Events ──
  bindWalletEvents() {
    document.getElementById('add-card-btn')?.addEventListener('click', () => {
      Wallet.showAddCardModal();
    });

    document.getElementById('add-card-empty')?.addEventListener('click', () => {
      Wallet.showAddCardModal();
    });

    document.querySelectorAll('.delete-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cardId = btn.dataset.cardId;
        
        const overlay = Utils.showModal(`
          <div class="modal__title">Remove Card?</div>
          <p style="text-align: center; margin-bottom: var(--space-6);">
            This card will be removed from your wallet. You can add it back anytime.
          </p>
          <div class="flex gap-3">
            <button class="btn btn--secondary btn--full" id="cancel-delete">Cancel</button>
            <button class="btn btn--danger btn--full" id="confirm-delete">Remove</button>
          </div>
        `, { center: true });

        document.getElementById('cancel-delete')?.addEventListener('click', () => {
          Utils.closeModal(overlay);
        });

        document.getElementById('confirm-delete')?.addEventListener('click', () => {
          Wallet.removeCard(cardId);
          Utils.closeModal(overlay);
          Utils.showToast('Removed', 'Card removed from wallet', 'info');
          App.render();
        });
      });
    });
  }
};
