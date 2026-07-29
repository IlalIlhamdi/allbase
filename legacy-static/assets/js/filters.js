/* ============================================================
   ALLBASE FILTERS & REALTIME SEARCH MODULE
   ============================================================ */

const FiltersModule = {
  init() {
    const searchInput = document.getElementById('projectSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        ProjectsModule.activeSearch = e.target.value.trim();
        ProjectsModule.renderProjectsList();
      }, 300));
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        ProjectsModule.activeCategory = btn.dataset.category || 'all';
        ProjectsModule.renderProjectsList();
      });
    });
  }
};
