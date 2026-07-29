/* ============================================================
   ALLBASE GLOBAL CONFIGURATION & APP STATE (STATIC)
   ============================================================ */

const ALLBASE_CONFIG = {
  APP_NAME: "ALLBASE — Portfolio, Projects & Tools",
  VERSION: "3.0.0",
  DOMAIN: "https://allbase.my.id",
  DEFAULT_FAVICON: "favicon.png",
  CATEGORIES: ["Networking", "Web Development", "Tools", "Pendidikan", "Sosial", "Personal"]
};

// Global Static State
const AppState = {
  theme: 'light',
  projects: [],
  activeFilters: {
    search: '',
    category: 'all'
  }
};
