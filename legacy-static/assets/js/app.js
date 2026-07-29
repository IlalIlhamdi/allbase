/* ============================================================
   ALLBASE MAIN APP ENGINE
   Static Portfolio & Tools Hub Initialization
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Theme Manager
  ThemeManager.init();

  // 2. Initialize Dynamic Projects, Skills & Experience Loader
  await ProjectsModule.init();

  // 3. Initialize Filters & Realtime Search
  FiltersModule.init();

  // 4. Initialize Vanilla 3D Tilt Cards
  Utils.initTiltCards();

  // 5. Mobile Drawer Menu Handler
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
      const icon = mobileBtn.querySelector('i');
      if (icon) {
        const isActive = mobileDrawer.classList.contains('active');
        icon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
        if (window.lucide) lucide.createIcons();
      }
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        const icon = mobileBtn.querySelector('i');
        if (icon) icon.setAttribute('data-lucide', 'menu');
        if (window.lucide) lucide.createIcons();
      });
    });
  }

  // 6. Section Active Observer for Navbar Navigation
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(sec => observer.observe(sec));
  }

  // 7. Dynamic Current Year in Footer
  const yearElem = document.getElementById('currentYear');
  if (yearElem) yearElem.textContent = new Date().getFullYear();

  // 8. Re-render Lucide Icons
  if (window.lucide) lucide.createIcons();
});
