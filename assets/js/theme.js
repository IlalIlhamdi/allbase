/* ============================================================
   ALLBASE THEME MANAGER
   Light Mode (Default) & Dark Navy Mode Switcher
   Unified localStorage key: allbase-theme
   ============================================================ */

const ThemeManager = {
  theme: 'light',

  init() {
    const savedTheme = localStorage.getItem('allbase-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      this.setTheme(savedTheme);
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
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    Utils.showToast(`Tema diubah ke ${newTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}`);
  }
};
