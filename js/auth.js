/* ============================================
   CardSaver.pk — Authentication Module (Phase 2)
   Sign up, sign in, profile management & Admin link
   ============================================ */

const Auth = {
  // ── Get current user ──
  getCurrentUser() {
    return Utils.storage.get('currentUser');
  },

  // ── Check if user is logged in ──
  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  // ── Check if onboarding completed ──
  hasCompletedOnboarding() {
    return Utils.storage.get('onboardingDone') === true;
  },

  // ── Complete onboarding ──
  completeOnboarding() {
    Utils.storage.set('onboardingDone', true);
  },

  // ── Sign Up ──
  signUp(name, email, password, city) {
    const users = Utils.storage.get('users') || [];
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const user = {
      id: Utils.generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: btoa(password),
      city: city,
      avatar: null,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    Utils.storage.set('users', users);

    const { password: _, ...safeUser } = user;
    Utils.storage.set('currentUser', safeUser);

    Notifications.add({
      type: 'welcome',
      title: 'Welcome to CardSaver! 🎉',
      body: 'Add your bank cards, SadaPay or NayaPay to discover amazing deals across Pakistan.',
      icon: '🎉'
    });

    return { success: true, user: safeUser };
  },

  // ── Sign In ──
  signIn(email, password) {
    const users = Utils.storage.get('users') || [];
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === btoa(password)
    );

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const { password: _, ...safeUser } = user;
    Utils.storage.set('currentUser', safeUser);
    return { success: true, user: safeUser };
  },

  // ── Sign Out ──
  signOut() {
    Utils.storage.remove('currentUser');
    window.location.hash = '#/auth';
    window.location.reload();
  },

  // ── Update Profile ──
  updateProfile(updates) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    const updatedUser = { ...currentUser, ...updates };
    Utils.storage.set('currentUser', updatedUser);

    const users = Utils.storage.get('users') || [];
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      Utils.storage.set('users', users);
    }

    return updatedUser;
  },

  // ── Render Auth Page ──
  renderAuthPage(mode = 'signin') {
    const isSignUp = mode === 'signup';
    
    return `
      <div class="auth-page page-enter">
        <div class="auth-page__logo">
          <div class="auth-page__logo-icon">
            ${Utils.getLogoSVG()}
          </div>
          <div class="auth-page__logo-text">CardSaver</div>
        </div>

        <div class="auth-page__form" id="auth-form">
          <h2 style="text-align:center; margin-bottom: var(--space-2);">
            ${isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style="text-align:center; margin-bottom: var(--space-4);">
            ${isSignUp ? 'Join thousands saving with every swipe' : 'Sign in to access your card deals'}
          </p>

          ${isSignUp ? `
            <div class="input-group">
              <label>Full Name</label>
              <div class="input-wrapper">
                ${Utils.getIcon('user', 20)}
                <input type="text" class="input-field input-field--with-icon" id="auth-name" 
                  placeholder="Ali Hassan" autocomplete="name">
              </div>
            </div>
          ` : ''}

          <div class="input-group">
            <label>Email</label>
            <div class="input-wrapper">
              ${Utils.getIcon('email', 20)}
              <input type="email" class="input-field input-field--with-icon" id="auth-email" 
                placeholder="you@example.com" autocomplete="email">
            </div>
          </div>

          <div class="input-group">
            <label>Password</label>
            <div class="input-wrapper">
              ${Utils.getIcon('lock', 20)}
              <input type="password" class="input-field input-field--with-icon" id="auth-password" 
                placeholder="••••••••" autocomplete="${isSignUp ? 'new-password' : 'current-password'}">
            </div>
          </div>

          ${isSignUp ? `
            <div class="input-group">
              <label>City</label>
              <div class="input-wrapper">
                ${Utils.getIcon('city', 20)}
                <select class="input-field input-field--with-icon" id="auth-city">
                  <option value="">Select your city</option>
                  ${Data.cities.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
              </div>
            </div>
          ` : ''}

          <button class="btn btn--primary btn--full btn--lg" id="auth-submit" style="margin-top: var(--space-4);">
            ${isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          <div class="auth-page__footer">
            <span>${isSignUp ? 'Already have an account? ' : "Don't have an account? "}</span>
            <a href="#" id="auth-toggle">${isSignUp ? 'Sign In' : 'Sign Up'}</a>
          </div>
        </div>
      </div>
    `;
  },

  // ── Bind Auth Events ──
  bindAuthEvents() {
    const isSignUp = document.getElementById('auth-name') !== null;
    
    document.getElementById('auth-submit')?.addEventListener('click', () => {
      if (isSignUp) {
        const name = document.getElementById('auth-name')?.value;
        const email = document.getElementById('auth-email')?.value;
        const password = document.getElementById('auth-password')?.value;
        const city = document.getElementById('auth-city')?.value;

        if (!name || !email || !password || !city) {
          Utils.showToast('Missing Fields', 'Please fill all fields', 'warning');
          return;
        }
        if (!Utils.isValidEmail(email)) {
          Utils.showToast('Invalid Email', 'Please enter a valid email', 'error');
          return;
        }
        if (password.length < 6) {
          Utils.showToast('Weak Password', 'Password must be at least 6 characters', 'warning');
          return;
        }

        const result = Auth.signUp(name, email, password, city);
        if (result.success) {
          Utils.showToast('Welcome! 🎉', 'Account created successfully', 'success');
          window.location.hash = '#/';
          App.render();
        } else {
          Utils.showToast('Error', result.error, 'error');
        }
      } else {
        const email = document.getElementById('auth-email')?.value;
        const password = document.getElementById('auth-password')?.value;

        if (!email || !password) {
          Utils.showToast('Missing Fields', 'Please enter email and password', 'warning');
          return;
        }

        const result = Auth.signIn(email, password);
        if (result.success) {
          Utils.showToast('Welcome back!', `Hello, ${result.user.name}`, 'success');
          window.location.hash = '#/';
          App.render();
        } else {
          Utils.showToast('Error', result.error, 'error');
        }
      }
    });

    document.getElementById('auth-toggle')?.addEventListener('click', (e) => {
      e.preventDefault();
      const newMode = isSignUp ? 'signin' : 'signup';
      const content = document.getElementById('page-content');
      if (content) {
        content.innerHTML = Auth.renderAuthPage(newMode);
        Auth.bindAuthEvents();
      }
    });

    document.querySelectorAll('#auth-form input').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          document.getElementById('auth-submit')?.click();
        }
      });
    });
  },

  // ── Render Profile Page ──
  renderProfilePage() {
    const user = this.getCurrentUser();
    if (!user) return '';

    const cards = Wallet.getCards();
    const groups = Groups.getGroups();
    const savedDeals = Utils.storage.get('savedDeals') || [];
    const theme = Utils.getTheme();

    return `
      <div class="page-enter">
        <div class="app-header">
          <div class="app-header__title">Profile</div>
          <button class="app-header__icon-btn" id="edit-profile-btn">
            ${Utils.getIcon('edit', 20)}
          </button>
        </div>

        <div class="profile-header">
          <div class="profile-header__avatar" style="background: ${Utils.getAvatarColor(user.name)}">
            ${Utils.getInitials(user.name)}
          </div>
          <div class="profile-header__name">${Utils.escapeHtml(user.name)}</div>
          <div class="profile-header__email">${Utils.escapeHtml(user.email)}</div>
          <div class="chip chip--sm" style="margin-top: var(--space-2);">
            📍 ${Utils.escapeHtml(user.city || 'Not set')}
          </div>
        </div>

        <div class="profile-stats stagger-in">
          <div class="stat-card">
            <div class="stat-card__value">${cards.length}</div>
            <div class="stat-card__label">Cards</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__value">${savedDeals.length}</div>
            <div class="stat-card__label">Saved</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__value">${groups.length}</div>
            <div class="stat-card__label">Groups</div>
          </div>
        </div>

        <div class="list-group__header">PREFERENCES</div>
        <div class="list-group">
          <div class="list-cell" id="toggle-theme-cell">
            <div class="list-cell__icon" style="background: rgba(175, 82, 222, 0.12); color: var(--accent-purple);">
              ${theme === 'dark' ? '🌙' : '☀️'}
            </div>
            <div class="list-cell__content">
              <div class="list-cell__title">Dark Mode</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="theme-toggle" ${theme === 'dark' ? 'checked' : ''}>
              <span class="toggle__track"></span>
            </label>
          </div>
          <div class="list-cell" id="change-city-cell">
            <div class="list-cell__icon" style="background: rgba(0, 122, 255, 0.12);">📍</div>
            <div class="list-cell__content">
              <div class="list-cell__title">City</div>
              <div class="list-cell__subtitle">${user.city || 'Not set'}</div>
            </div>
            ${Utils.getIcon('chevronRight', 12)}
          </div>
        </div>

        <div class="list-group__header">ADMIN & MANAGEMENT</div>
        <div class="list-group">
          <div class="list-cell" id="admin-panel-cell">
            <div class="list-cell__icon" style="background: rgba(255, 149, 0, 0.15); color: var(--accent-orange);">📊</div>
            <div class="list-cell__content">
              <div class="list-cell__title">Admin Dashboard</div>
              <div class="list-cell__subtitle">Analytics, deal manager & stats</div>
            </div>
            ${Utils.getIcon('chevronRight', 12)}
          </div>
        </div>

        <div class="list-group__header">ABOUT</div>
        <div class="list-group">
          <div class="list-cell">
            <div class="list-cell__icon" style="background: rgba(0, 122, 255, 0.12);">ℹ️</div>
            <div class="list-cell__content">
              <div class="list-cell__title">Version</div>
            </div>
            <div class="list-cell__value">2.0.0 (Phase 2 Enhanced)</div>
          </div>
        </div>

        <div style="padding: var(--space-6) var(--space-5);">
          <button class="btn btn--danger btn--full" id="signout-btn">
            ${Utils.getIcon('logout', 20)} Sign Out
          </button>
        </div>
      </div>
    `;
  },

  // ── Bind Profile Events ──
  bindProfileEvents() {
    document.getElementById('theme-toggle')?.addEventListener('change', () => {
      Utils.toggleTheme();
      App.render();
    });

    document.getElementById('signout-btn')?.addEventListener('click', () => {
      Auth.signOut();
    });

    document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
      const user = Auth.getCurrentUser();
      const overlay = Utils.showModal(`
        <div class="modal__title">Edit Profile</div>
        <div class="flex-col gap-4">
          <div class="input-group">
            <label>Name</label>
            <input type="text" class="input-field" id="edit-name" value="${Utils.escapeHtml(user.name)}">
          </div>
          <div class="input-group">
            <label>City</label>
            <select class="input-field" id="edit-city">
              ${Data.cities.map(c => `<option value="${c}" ${c === user.city ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <button class="btn btn--primary btn--full" id="save-profile-btn">Save Changes</button>
        </div>
      `);

      document.getElementById('save-profile-btn')?.addEventListener('click', () => {
        const name = document.getElementById('edit-name')?.value;
        const city = document.getElementById('edit-city')?.value;
        if (name) {
          Auth.updateProfile({ name, city });
          Utils.closeModal(overlay);
          Utils.showToast('Updated', 'Profile updated successfully', 'success');
          App.render();
        }
      });
    });

    document.getElementById('change-city-cell')?.addEventListener('click', () => {
      const user = Auth.getCurrentUser();
      const overlay = Utils.showModal(`
        <div class="modal__title">Select City</div>
        <div class="flex-col gap-2">
          ${Data.cities.map(c => `
            <div class="list-cell city-option" data-city="${c}" style="border-radius: var(--radius-md); ${c === user.city ? 'background: rgba(0,122,255,0.08);' : ''}">
              <div class="list-cell__content">
                <div class="list-cell__title">${c}</div>
              </div>
              ${c === user.city ? '<span style="color: var(--accent-blue);">✓</span>' : ''}
            </div>
          `).join('')}
        </div>
      `);

      overlay.querySelectorAll('.city-option').forEach(el => {
        el.addEventListener('click', () => {
          Auth.updateProfile({ city: el.dataset.city });
          Utils.closeModal(overlay);
          Utils.showToast('Updated', `City set to ${el.dataset.city}`, 'success');
          App.render();
        });
      });
    });
  }
};
