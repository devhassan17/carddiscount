/* ============================================
   CardSaver.pk — Utilities & Helpers (Phase 8 Official Bank Logos & Deals)
   ============================================ */

const Utils = {
  // ── Local Storage Wrapper ──
  storage: {
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(`cardsaver_${key}`);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.error(`Error reading ${key} from storage:`, e);
        return defaultValue;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(`cardsaver_${key}`, JSON.stringify(value));
      } catch (e) {
        console.error(`Error writing ${key} to storage:`, e);
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(`cardsaver_${key}`);
      } catch (e) {
        console.error(`Error removing ${key} from storage:`, e);
      }
    }
  },

  // ── Official Bank Logo Badge HTML Generator (Screenshot 2 Match) ──
  getBankLogoHtml(bank) {
    if (!bank) return '';
    const bId = bank.id.toLowerCase();

    switch(bId) {
      case 'mcb':
        return `<div class="bank-logo-badge" style="background:#005936;color:white;font-weight:900;font-size:12px;letter-spacing:1px;box-shadow:0 2px 6px rgba(0,89,54,0.3);">MCB</div>`;
      case 'faysal':
        return `<div class="bank-logo-badge" style="background:#FFFFFF;border:1.5px solid #1E3A5F;color:#1E3A5F;font-weight:bold;font-size:10px;">faysalbank</div>`;
      case 'albaraka':
        return `<div class="bank-logo-badge" style="background:#FFFFFF;border:1.5px solid #C59B27;color:#C59B27;font-weight:bold;font-size:10px;">albaraka ⚜️</div>`;
      case 'mcbislamic':
        return `<div class="bank-logo-badge" style="background:#005936;color:#FFD700;font-weight:bold;font-size:9px;">MCB Islamic</div>`;
      case 'allied':
        return `<div class="bank-logo-badge" style="background:#00447C;color:#FF6B00;font-weight:900;font-size:12px;">ABL <span style="color:white">Allied</span></div>`;
      case 'askari':
        return `<div class="bank-logo-badge" style="background:#FFFFFF;border:1.5px solid #003976;color:#003976;font-weight:bold;font-size:10px;">askaribank 💠</div>`;
      case 'bah':
        return `<div class="bank-logo-badge" style="background:#004225;color:#FFD700;font-weight:bold;font-size:10px;">🦁 AL HABIB</div>`;
      case 'alfalah':
        return `<div class="bank-logo-badge" style="background:#ED1C24;color:white;font-weight:bold;font-size:10px;">▲ Alfalah</div>`;
      case 'bop':
        return `<div class="bank-logo-badge" style="background:#FFFFFF;border:1.5px solid #1D4289;color:#1D4289;font-weight:900;font-size:13px;">BOP</div>`;
      case 'bankislami':
        return `<div class="bank-logo-badge" style="background:#FFFFFF;border:1.5px solid #2E7D32;color:#2E7D32;font-weight:bold;font-size:10px;">BankIslami</div>`;
      case 'hbl':
        return `<div class="bank-logo-badge" style="background:#00833D;color:white;font-weight:900;font-size:14px;letter-spacing:1px;box-shadow:0 2px 6px rgba(0,131,61,0.3);">HBL</div>`;
      case 'habibmetro':
        return `<div class="bank-logo-badge" style="background:#004D40;color:#FFD700;font-weight:bold;font-size:10px;">HabibMetro</div>`;
      case 'hblislamic':
        return `<div class="bank-logo-badge" style="background:#005930;color:white;font-weight:bold;font-size:9px;">HBL Islamic</div>`;
      case 'jsbank', 'js':
        return `<div class="bank-logo-badge" style="background:#FFFFFF;border:1.5px solid #F37021;color:#F37021;font-weight:900;font-size:11px;">% JS BANK</div>`;
      case 'meezan':
        return `<div class="bank-logo-badge" style="background:#00594C;color:#FFD700;font-weight:bold;font-size:10px;box-shadow:0 2px 6px rgba(0,89,76,0.3);">☪ Meezan</div>`;
      case 'ubl':
        return `<div class="bank-logo-badge" style="background:#E31837;color:white;font-weight:900;font-size:14px;box-shadow:0 2px 6px rgba(227,24,55,0.3);">UBL</div>`;
      case 'sadapay':
        return `<div class="bank-logo-badge" style="background:#1ED760;color:black;font-weight:bold;font-size:11px;box-shadow:0 2px 6px rgba(30,215,96,0.3);">SadaPay</div>`;
      case 'nayapay':
        return `<div class="bank-logo-badge" style="background:#6C63FF;color:white;font-weight:bold;font-size:11px;box-shadow:0 2px 6px rgba(108,99,255,0.3);">NayaPay</div>`;
      case 'easypaisa':
        return `<div class="bank-logo-badge" style="background:#4CAF50;color:white;font-weight:bold;font-size:10px;">easypaisa</div>`;
      case 'jazzcash':
        return `<div class="bank-logo-badge" style="background:#E53935;color:white;font-weight:bold;font-size:10px;">JazzCash</div>`;
      default:
        return `<div class="bank-logo-badge" style="background:${bank.color || '#007AFF'};color:white;font-weight:bold;">${bank.name}</div>`;
    }
  },

  // ── Validation Helpers ──
  isValidEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  isValidPhone(phone) {
    if (!phone) return false;
    const re = /^(\+92|0)?3\d{9}$/;
    return re.test(String(phone).replace(/[\s-]/g, ''));
  },

  // ── ID Generator ──
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  },

  // ── Date Helpers ──
  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  daysUntil(dateString) {
    if (!dateString) return 0;
    const target = new Date(dateString);
    const now = new Date();
    const diffTime = target - now;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  },

  isExpired(dateString) {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  },

  // ── Debounce ──
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // ── Toast Notifications ──
  showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container') || this.createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast--${type} fade-in`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
      <div style="font-size: 20px;">${icon}</div>
      <div style="flex: 1;">
        <div style="font-weight: 600; font-size: 14px;">${this.escapeHtml(title)}</div>
        ${message ? `<div style="font-size: 12px; color: var(--text-secondary);">${this.escapeHtml(message)}</div>` : ''}
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  },

  createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  },

  // ── Modal Dialogs ──
  showModal(contentHtml, options = {}) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay fade-in';
    
    const modal = document.createElement('div');
    modal.className = `modal ${options.center ? 'modal--center' : ''}`;
    modal.innerHTML = contentHtml;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay && !options.persistent) {
        this.closeModal(overlay);
      }
    });

    return overlay;
  },

  closeModal(modalOverlay) {
    if (!modalOverlay) return;
    modalOverlay.classList.add('fade-out');
    setTimeout(() => modalOverlay.remove(), 300);
  },

  // ── Color Generators for Bank Cards & Avatars ──
  getAvatarColor(name) {
    const colors = [
      '#FF9500', '#34C759', '#007AFF', '#AF52DE', 
      '#FF2D55', '#5AC8FA', '#FF3B30', '#5856D6'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  },

  getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  },

  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  getTheme() {
    return localStorage.getItem('cardsaver_theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  },

  setTheme(theme) {
    localStorage.setItem('cardsaver_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  },

  toggleTheme() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    return next;
  },

  // ── App Brand Logo SVG Generator ──
  getLogoSVG(size = 48) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#logo-grad)"/>
        <path d="M14 16H34C35.1 16 36 16.9 36 18V30C36 31.1 35.1 32 34 32H14C12.9 32 12 31.1 12 30V18C12 16.9 12.9 16 14 16Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 21H36" stroke="white" stroke-width="2"/>
        <circle cx="28" cy="26.5" r="2.5" fill="#FFD700"/>
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stop-color="#007AFF"/>
            <stop offset="1" stop-color="#0051A8"/>
          </linearGradient>
        </defs>
      </svg>
    `;
  },

  // ── SVG Icon Helper ──
  getIcon(name, size = 24, color = 'currentColor') {
    const icons = {
      home: `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
      deals: `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>`,
      wallet: `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`,
      groups: `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
      profile: `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
      search: `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
      bell: `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`,
      plus: `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
      check: `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
      chevronRight: `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>`,
      back: `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`,
      share: `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>`,
      heart: `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>`,
      heartFilled: `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="var(--accent-red)"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    };
    return icons[name] || '';
  }
};
