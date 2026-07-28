/* ============================================================
   ALLBASE SHARED SUBPAGE ENGINE
   Theme Manager (allbase-theme), Toast Notifications, Lucide Init
   ============================================================ */

const SubpageEngine = {
  theme: 'light',

  init() {
    this.initTheme();
    this.initFooterYear();
    if (window.lucide) lucide.createIcons();
  },

  initTheme() {
    const saved = localStorage.getItem('allbase-theme');
    if (saved === 'dark' || saved === 'light') {
      this.setTheme(saved);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => this.toggleTheme());
    });
  },

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('allbase-theme', theme);

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
      }
    });

    if (window.lucide) lucide.createIcons();
  },

  toggleTheme() {
    const next = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    this.showToast(`Tema diubah ke ${next === 'dark' ? 'Dark Mode' : 'Light Mode'}`);
  },

  initFooterYear() {
    const elem = document.getElementById('footerYear');
    if (elem) elem.textContent = new Date().getFullYear();
  },

  showToast(msg, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    const borderColor = type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary)';
    toast.style.borderLeft = `4px solid ${borderColor}`;
    toast.innerHTML = `<span>${this.escapeHtml(msg)}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

document.addEventListener('DOMContentLoaded', () => SubpageEngine.init());
