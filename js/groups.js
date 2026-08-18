/* ============================================
   CardSaver.pk — Groups Module
   Friend groups & collective wallet
   ============================================ */

const Groups = {
  // ── Get all groups ──
  getGroups() {
    return Utils.storage.get('groups') || [];
  },

  // ── Create group ──
  createGroup(name, icon, description) {
    const groups = this.getGroups();
    const user = Auth.getCurrentUser();
    const userCards = Wallet.getCards();

    const group = {
      id: Utils.generateId(),
      name: name.trim(),
      icon: icon,
      description: description || '',
      members: [{
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'admin',
        joinedAt: new Date().toISOString(),
      }],
      collectiveCards: userCards.map(c => ({
        ...c,
        ownerId: user.id,
        ownerName: user.name,
      })),
      createdAt: new Date().toISOString(),
    };

    groups.push(group);
    Utils.storage.set('groups', groups);

    Notifications.add({
      type: 'group_created',
      title: 'Group Created! 👥',
      body: `"${name}" group has been created. Invite friends to share deals!`,
      icon: '👥',
    });

    return group;
  },

  // ── Add member to group ──
  addMember(groupId, email) {
    const groups = this.getGroups();
    const group = groups.find(g => g.id === groupId);
    if (!group) return { success: false, error: 'Group not found' };

    // Check if already a member
    if (group.members.some(m => m.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Already a member' };
    }

    // Check if user exists
    const users = Utils.storage.get('users') || [];
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    const member = {
      id: existingUser?.id || Utils.generateId(),
      name: existingUser?.name || email.split('@')[0],
      email: email.toLowerCase(),
      role: 'member',
      joinedAt: new Date().toISOString(),
    };

    group.members.push(member);

    // If existing user, add their cards to collective wallet
    if (existingUser) {
      const memberCards = Wallet.getCards(); // In real app, fetch user-specific cards
      memberCards.forEach(card => {
        if (!group.collectiveCards.some(c => c.id === card.id)) {
          group.collectiveCards.push({
            ...card,
            ownerId: member.id,
            ownerName: member.name,
          });
        }
      });
    }

    Utils.storage.set('groups', groups);

    Notifications.add({
      type: 'member_added',
      title: 'Member Added! 🎉',
      body: `${member.name} has been added to "${group.name}".`,
      icon: '🎉',
    });

    return { success: true, member };
  },

  // ── Remove member ──
  removeMember(groupId, memberId) {
    const groups = this.getGroups();
    const group = groups.find(g => g.id === groupId);
    if (!group) return false;

    group.members = group.members.filter(m => m.id !== memberId);
    group.collectiveCards = group.collectiveCards.filter(c => c.ownerId !== memberId);
    Utils.storage.set('groups', groups);
    return true;
  },

  // ── Delete group ──
  deleteGroup(groupId) {
    let groups = this.getGroups();
    groups = groups.filter(g => g.id !== groupId);
    Utils.storage.set('groups', groups);
  },

  // ── Render Groups Page ──
  renderGroupsPage() {
    const groups = this.getGroups();
    const allDeals = Deals.getAllDeals();

    return `
      <div class="page-enter">
        <div class="app-header">
          <div class="app-header__title">Groups</div>
          <button class="app-header__icon-btn" id="create-group-btn">
            ${Utils.getIcon('plus', 20)}
          </button>
        </div>

        <div class="app-header__large-title">My Groups</div>

        ${groups.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state__icon">👥</div>
            <div class="empty-state__title">No Groups Yet</div>
            <div class="empty-state__text">Create a group and invite friends to combine your cards and discover more deals together!</div>
            <button class="btn btn--primary btn--pill" id="create-group-empty">
              ${Utils.getIcon('plus', 18)} Create Group
            </button>
          </div>
        ` : `
          <div class="flex-col gap-3 stagger-in" style="padding: 0 var(--space-5);">
            ${groups.map(group => {
              const groupDeals = Data.getGroupDeals(group.collectiveCards, allDeals);
              const randomColor = Data.groupColors[groups.indexOf(group) % Data.groupColors.length];
              return `
                <div class="group-card" onclick="App.navigateTo('#/groups/${group.id}')">
                  <div class="group-card__icon" style="background: ${randomColor};">
                    ${group.icon}
                  </div>
                  <div class="group-card__info">
                    <div class="group-card__name">${Utils.escapeHtml(group.name)}</div>
                    <div class="group-card__members">${group.members.length} member${group.members.length > 1 ? 's' : ''} • ${group.collectiveCards.length} cards</div>
                  </div>
                  <div class="group-card__deals-count">${groupDeals.length} deals</div>
                </div>
              `;
            }).join('')}
          </div>
        `}

        <div style="height: var(--space-8);"></div>
      </div>
    `;
  },

  // ── Render Group Detail ──
  renderGroupDetail(groupId) {
    const groups = this.getGroups();
    const group = groups.find(g => g.id === groupId);
    if (!group) return '<div class="empty-state"><div class="empty-state__title">Group not found</div></div>';

    const allDeals = Deals.getAllDeals();
    const groupDeals = Data.getGroupDeals(group.collectiveCards, allDeals);
    const user = Auth.getCurrentUser();
    const isAdmin = group.members.find(m => m.id === user?.id)?.role === 'admin';

    return `
      <div class="page-enter">
        <div class="app-header">
          <button class="app-header__icon-btn" onclick="App.navigateTo('#/groups')">
            ${Utils.getIcon('back', 20)}
          </button>
          <div class="app-header__title">${Utils.escapeHtml(group.name)}</div>
          ${isAdmin ? `
            <button class="app-header__icon-btn" id="group-settings-btn">
              ${Utils.getIcon('settings', 20)}
            </button>
          ` : '<div></div>'}
        </div>

        <div class="group-detail__header">
          <div class="group-detail__icon" style="background: ${Data.groupColors[0]}; font-size: 36px;">
            ${group.icon}
          </div>
          <h2>${Utils.escapeHtml(group.name)}</h2>
          ${group.description ? `<p class="text-secondary" style="margin-top: var(--space-2);">${Utils.escapeHtml(group.description)}</p>` : ''}
        </div>

        <!-- Stats -->
        <div class="wallet-page__stats stagger-in" style="margin-bottom: var(--space-6);">
          <div class="stat-card">
            <div class="stat-card__value">${group.members.length}</div>
            <div class="stat-card__label">Members</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__value">${group.collectiveCards.length}</div>
            <div class="stat-card__label">Cards</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__value">${groupDeals.length}</div>
            <div class="stat-card__label">Deals</div>
          </div>
        </div>

        <!-- Members -->
        <div class="section-header">
          <div class="section-header__title">Members</div>
          ${isAdmin ? `<button class="section-header__action" id="invite-member-btn">+ Invite</button>` : ''}
        </div>
        <div class="group-detail__members-grid stagger-in" style="margin-bottom: var(--space-6);">
          ${group.members.map(m => `
            <div class="group-detail__member">
              <div class="avatar" style="background: ${Utils.getAvatarColor(m.name)};">
                ${Utils.getInitials(m.name)}
              </div>
              <div class="group-detail__member-name">
                ${Utils.escapeHtml(m.name.split(' ')[0])}
                ${m.role === 'admin' ? '👑' : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Collective Wallet -->
        <div class="section-header">
          <div class="section-header__title">Collective Wallet</div>
        </div>
        <div class="scroll-h" style="margin-bottom: var(--space-6);">
          ${group.collectiveCards.length === 0 ? `
            <div class="empty-state" style="padding: var(--space-6); min-width: 200px;">
              <div class="text-secondary">No cards yet</div>
            </div>
          ` : group.collectiveCards.map(card => {
            const bank = Data.getBank(card.bank);
            return `
              <div class="bank-card bank-card--${bank?.cssClass || 'hbl'}" 
                style="min-width: 280px; max-width: 300px; font-size: 0.85em;">
                <div class="bank-card__header">
                  <div class="bank-card__bank-name">${bank?.name || 'Bank'}</div>
                  <div class="bank-card__chip"></div>
                </div>
                <div class="bank-card__number">•••• •••• •••• ${card.last4}</div>
                <div class="bank-card__footer">
                  <div>
                    <div class="bank-card__name">${Utils.escapeHtml(card.ownerName || 'Member')}</div>
                    <div class="bank-card__type">${card.type}</div>
                  </div>
                  <div class="bank-card__network">${card.network}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Group Deals -->
        <div class="section-header">
          <div class="section-header__title">Group Deals (${groupDeals.length})</div>
        </div>
        ${groupDeals.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state__icon">🏷️</div>
            <div class="empty-state__title">No Matching Deals</div>
            <div class="empty-state__text">Add more cards to unlock deals for the group.</div>
          </div>
        ` : `
          <div class="flex-col gap-3 stagger-in" style="padding: 0 var(--space-5);">
            ${groupDeals.slice(0, 10).map(d => Deals.renderDealCardH(d)).join('')}
            ${groupDeals.length > 10 ? `
              <button class="btn btn--ghost btn--full" onclick="Deals.activeFilters = {}; App.navigateTo('#/deals');">
                View all ${groupDeals.length} deals →
              </button>
            ` : ''}
          </div>
        `}

        <div style="height: var(--space-8);"></div>
      </div>
    `;
  },

  // ── Show Create Group Modal ──
  showCreateGroupModal() {
    const overlay = Utils.showModal(`
      <div class="modal__title">Create Group</div>
      <div class="flex-col gap-4">
        <div class="input-group">
          <label>Group Name</label>
          <input type="text" class="input-field" id="group-name" placeholder="e.g., Weekend Foodies">
        </div>

        <div class="input-group">
          <label>Select Icon</label>
          <div class="flex flex-wrap gap-2" id="group-icons">
            ${Data.groupIcons.map((icon, i) => `
              <button class="btn btn--icon ${i === 0 ? 'btn--primary' : 'btn--secondary'}" 
                data-icon="${icon}" style="font-size: 20px; width: 48px; height: 48px;">
                ${icon}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="input-group">
          <label>Description (Optional)</label>
          <input type="text" class="input-field" id="group-desc" placeholder="What's this group about?">
        </div>

        <button class="btn btn--primary btn--full" id="save-group-btn">Create Group</button>
      </div>
    `);

    let selectedIcon = Data.groupIcons[0];

    overlay.querySelectorAll('[data-icon]').forEach(btn => {
      btn.addEventListener('click', () => {
        overlay.querySelectorAll('[data-icon]').forEach(b => {
          b.className = 'btn btn--icon btn--secondary';
          b.style.fontSize = '20px';
          b.style.width = '48px';
          b.style.height = '48px';
        });
        btn.className = 'btn btn--icon btn--primary';
        btn.style.fontSize = '20px';
        btn.style.width = '48px';
        btn.style.height = '48px';
        selectedIcon = btn.dataset.icon;
      });
    });

    document.getElementById('save-group-btn')?.addEventListener('click', () => {
      const name = document.getElementById('group-name')?.value;
      const desc = document.getElementById('group-desc')?.value;

      if (!name) {
        Utils.showToast('Required', 'Please enter a group name', 'warning');
        return;
      }

      Groups.createGroup(name, selectedIcon, desc);
      Utils.closeModal(overlay);
      Utils.showToast('Group Created! 🎉', `"${name}" is ready`, 'success');
      App.render();
    });
  },

  // ── Bind Group Events ──
  bindGroupEvents() {
    document.getElementById('create-group-btn')?.addEventListener('click', () => {
      this.showCreateGroupModal();
    });

    document.getElementById('create-group-empty')?.addEventListener('click', () => {
      this.showCreateGroupModal();
    });

    document.getElementById('invite-member-btn')?.addEventListener('click', () => {
      const groupId = window.location.hash.split('/').pop();
      const overlay = Utils.showModal(`
        <div class="modal__title">Invite Member</div>
        <div class="flex-col gap-4">
          <p class="text-center text-secondary">Enter your friend's email to invite them to the group.</p>
          <div class="input-group">
            <label>Email Address</label>
            <div class="input-wrapper">
              ${Utils.getIcon('email', 20)}
              <input type="email" class="input-field input-field--with-icon" id="invite-email" 
                placeholder="friend@example.com">
            </div>
          </div>
          <button class="btn btn--primary btn--full" id="send-invite-btn">Send Invite</button>
        </div>
      `);

      document.getElementById('send-invite-btn')?.addEventListener('click', () => {
        const email = document.getElementById('invite-email')?.value;
        if (!email || !Utils.isValidEmail(email)) {
          Utils.showToast('Invalid', 'Please enter a valid email', 'error');
          return;
        }

        const result = Groups.addMember(groupId, email);
        if (result.success) {
          Utils.closeModal(overlay);
          Utils.showToast('Invited! ✉️', `${email} has been added`, 'success');
          App.render();
        } else {
          Utils.showToast('Error', result.error, 'error');
        }
      });
    });

    document.getElementById('group-settings-btn')?.addEventListener('click', () => {
      const groupId = window.location.hash.split('/').pop();
      const overlay = Utils.showModal(`
        <div class="modal__title">Group Settings</div>
        <div class="flex-col gap-3">
          <button class="btn btn--danger btn--full" id="delete-group-btn">
            ${Utils.getIcon('trash', 18)} Delete Group
          </button>
          <button class="btn btn--secondary btn--full" id="cancel-settings-btn">Cancel</button>
        </div>
      `, { center: true });

      document.getElementById('delete-group-btn')?.addEventListener('click', () => {
        Groups.deleteGroup(groupId);
        Utils.closeModal(overlay);
        Utils.showToast('Deleted', 'Group has been deleted', 'info');
        App.navigateTo('#/groups');
      });

      document.getElementById('cancel-settings-btn')?.addEventListener('click', () => {
        Utils.closeModal(overlay);
      });
    });
  }
};
