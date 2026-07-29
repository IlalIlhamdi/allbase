/* ============================================================
   ALLBASE UTILITIES
   Debounce, HTML Escaping, Toast, Vanilla 3D Tilt Card Effect
   ============================================================ */

const Utils = {
  // Safe HTML Escaping
  escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  // Debounce helper for realtime search
  debounce(func, wait = 300) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  // Toast Notification
  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `card toast-item animate-fade-up`;
    toast.style.cssText = `padding:12px 18px;min-width:260px;box-shadow:var(--shadow-lg);display:flex;align-items:center;gap:10px;font-size:0.88rem;border-left:4px solid ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary)'}`;
    toast.innerHTML = `<span>${Utils.escapeHtml(message)}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Vanilla 3D Tilt Effect for Profile & Main Featured Card
  initTiltCards() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // Disable on touch devices

    document.querySelectorAll('[data-tilt]').forEach(card => {
      if (card.dataset.tiltInitialized) return;
      card.dataset.tiltInitialized = 'true';

      const amplitude = parseFloat(card.dataset.tiltAmplitude) || 8;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotateX = -dy * amplitude;
        const rotateY = dx * amplitude;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        card.style.transition = 'transform 0.4s ease';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.05s ease-out';
      });
    });
  }
};
