/* ============================================
   CardSaver.pk — Notifications Module
   In-app notification center
   ============================================ */

const Notifications = {
  // ── Get all notifications ──
  getAll() {
    return Utils.storage.get('notifications') || [];
  },

  // ── Get unread count ──
  getUnreadCount() {
    return this.getAll().filter(n => !n.read).length;
  },

  // ── Add notification ──
  add(data) {
    const notifications = this.getAll();
    const notification = {
      id: Utils.generateId(),
      type: data.type || 'info',
      title: data.title,
      body: data.body || '',
      icon: data.icon || 'ℹ️',
      read: false,
      createdAt: new Date().toISOString(),
    };

    notifications.unshift(notification);
    
    // Keep max 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50);
    }

    Utils.storage.set('notifications', notifications);
    this.updateBadge();
    return notification;
  },

  // ── Mark as read ──
  markAsRead(notificationId) {
    const notifications = this.getAll();
    const n = notifications.find(n => n.id === notificationId);
    if (n) {
      n.read = true;
      Utils.storage.set('notifications', notifications);
      this.updateBadge();
    }
  },

  // ── Mark all as read ──
  markAllAsRead() {
    const notifications = this.getAll();
    notifications.forEach(n => n.read = true);
    Utils.storage.set('notifications', notifications);
    this.updateBadge();
  },

  // ── Update badge count ──
  updateBadge() {
    const count = this.getUnreadCount();
    const badge = document.getElementById('notification-badge');
    if (badge) {
      if (count > 0) {
        badge.textContent = count > 9 ? '9+' : count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  },

  // ── Render Notifications Page ──
  renderNotificationsPage() {
    const notifications = this.getAll();

    return `
      <div class="page-enter">
        <div class="app-header">
          <div class="app-header__title">Notifications</div>
          ${notifications.length > 0 ? `
            <button class="btn btn--ghost btn--sm" id="mark-all-read-btn">Mark All Read</button>
          ` : ''}
        </div>

        <div class="app-header__large-title">Notifications</div>

        ${notifications.length === 0 ? `
          <div class="empty-state notifications-page__empty">
            <div class="empty-state__icon">🔔</div>
            <div class="empty-state__title">All Caught Up!</div>
            <div class="empty-state__text">You'll see new deal alerts and group notifications here.</div>
          </div>
        ` : `
          <div class="stagger-in">
            ${notifications.map(n => `
              <div class="notification-cell ${n.read ? '' : 'unread'}" data-notification-id="${n.id}">
                ${!n.read ? '' : ''}
                <div style="font-size: 24px; flex-shrink: 0;">${n.icon}</div>
                <div style="flex: 1; min-width: 0;">
                  <div style="font-weight: var(--weight-semibold); font-size: var(--text-base); margin-bottom: 2px;">
                    ${Utils.escapeHtml(n.title)}
                  </div>
                  <div style="font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-normal);">
                    ${Utils.escapeHtml(n.body)}
                  </div>
                  <div style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-1);">
                    ${Utils.timeAgo(n.createdAt)}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  },

  // ── Bind Notification Events ──
  bindNotificationEvents() {
    document.getElementById('mark-all-read-btn')?.addEventListener('click', () => {
      this.markAllAsRead();
      Utils.showToast('Done', 'All notifications marked as read', 'success');
      App.render();
    });

    document.querySelectorAll('.notification-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const id = cell.dataset.notificationId;
        this.markAsRead(id);
        cell.classList.remove('unread');
        this.updateBadge();
      });
    });
  },

  // ── Generate initial deal notifications ──
  generateDealAlerts() {
    const cards = Wallet.getCards();
    if (cards.length === 0) return;

    const deals = Deals.getAllDeals();
    const matching = Data.getMatchingDeals(cards, deals);
    const expiringSoon = matching.filter(d => {
      const days = Utils.daysUntil(d.validTo);
      return days > 0 && days <= 7;
    });

    expiringSoon.forEach(deal => {
      const existing = this.getAll().find(n => n.type === 'deal_expiry' && n.title.includes(deal.merchant));
      if (!existing) {
        this.add({
          type: 'deal_expiry',
          title: `⏰ ${deal.merchant} deal expiring!`,
          body: `${deal.discount}% off expires in ${Utils.daysUntil(deal.validTo)} days. Use it before it's gone!`,
          icon: '⏰',
        });
      }
    });
  }
};
