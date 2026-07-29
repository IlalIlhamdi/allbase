/* ============================================================
   ALLBASE DYNAMIC PROJECT & DATA RENDERER
   Loads data/projects.json, skills.json, experience.json via fetch()
   ============================================================ */

const ProjectsModule = {
  projects: [],
  skills: [],
  experience: {},
  activeCategory: 'all',
  activeSearch: '',
  activeType: 'all', // 'all', 'project', 'tool'

  async init() {
    await Promise.all([
      this.loadProjects(),
      this.loadSkills(),
      this.loadExperience()
    ]);
  },

  async loadProjects() {
    try {
      const res = await fetch('data/projects.json');
      if (!res.ok) throw new Error("Gagal membaca projects.json");
      this.projects = await res.json();
      this.renderFeaturedProjects();
      this.renderProjectsList();
      this.renderToolsList();
    } catch (err) {
      console.error("Projects load error:", err);
    }
  },

  async loadSkills() {
    try {
      const res = await fetch('data/skills.json');
      if (!res.ok) throw new Error("Gagal membaca skills.json");
      this.skills = await res.json();
      this.renderSkillsList();
    } catch (err) {
      console.error("Skills load error:", err);
    }
  },

  async loadExperience() {
    try {
      const res = await fetch('data/experience.json');
      if (!res.ok) throw new Error("Gagal membaca experience.json");
      this.experience = await res.json();
      this.renderCertifications();
    } catch (err) {
      console.error("Experience load error:", err);
    }
  },

  renderFeaturedProjects() {
    const container = document.getElementById('featuredProjectsContainer');
    if (!container) return;

    const featured = this.projects.filter(p => p.featured);
    if (featured.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = featured.slice(0, 3).map(p => this.createProjectCardHtml(p, true)).join('');
    if (window.lucide) lucide.createIcons();
  },

  renderProjectsList() {
    const container = document.getElementById('projectsGridContainer');
    if (!container) return;

    const filtered = this.projects.filter(p => {
      const isProject = p.type === 'project';
      const matchesCat = this.activeCategory === 'all' || p.category.toLowerCase() === this.activeCategory.toLowerCase();
      const matchesSearch = !this.activeSearch || 
        p.title.toLowerCase().includes(this.activeSearch.toLowerCase()) || 
        p.description.toLowerCase().includes(this.activeSearch.toLowerCase()) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(this.activeSearch.toLowerCase())));
      return isProject && matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="card" style="grid-column:1/-1;text-align:center;padding:40px;">
          <i data-lucide="folder-x" style="width:40px;height:40px;color:var(--text-muted);margin-bottom:12px;"></i>
          <h3>Tidak Ada Proyek Ditemukan</h3>
          <p>Coba gunakan kata kunci pencarian atau kategori yang berbeda.</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    container.innerHTML = filtered.map(p => this.createProjectCardHtml(p)).join('');
    if (window.lucide) lucide.createIcons();
  },

  renderToolsList() {
    const container = document.getElementById('toolsGridContainer');
    if (!container) return;

    const tools = this.projects.filter(p => p.type === 'tool');
    container.innerHTML = tools.map(t => this.createProjectCardHtml(t)).join('');
    if (window.lucide) lucide.createIcons();
  },

  createProjectCardHtml(p, isFeatured = false) {
    const hasUrl = p.url && p.url.trim() !== '';
    const statusMap = {
      completed: `<span class="badge badge-success">Selesai</span>`,
      development: `<span class="badge badge-warning">Dalam Pengembangan</span>`,
      experiment: `<span class="badge badge-primary">Eksperimen</span>`,
      upcoming: `<span class="badge badge-secondary">Segera Hadir</span>`
    };
    const statusBadge = statusMap[p.status] || `<span class="badge badge-secondary">${Utils.escapeHtml(p.status)}</span>`;

    return `
      <div class="card card-hover project-card ${isFeatured ? 'card-featured' : ''}">
        <div class="project-card-header">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="project-icon-box">
              <i data-lucide="${Utils.escapeHtml(p.icon || 'folder')}"></i>
            </div>
            <div>
              <div class="project-title">${Utils.escapeHtml(p.title)}</div>
              <span class="badge badge-secondary">${Utils.escapeHtml(p.category)}</span>
            </div>
          </div>
          ${statusBadge}
        </div>

        <p class="project-desc">${Utils.escapeHtml(p.description)}</p>

        <div class="project-tags">
          ${(p.tags || []).map(t => `<span class="tag">${Utils.escapeHtml(t)}</span>`).join('')}
        </div>

        <div class="project-footer">
          ${hasUrl ? `
            <a href="${Utils.escapeHtml(p.url)}" ${p.openMode === 'new-tab' ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-sm btn-primary">
              <i data-lucide="${p.type === 'tool' ? 'wrench' : 'external-link'}" style="width:14px;height:14px;"></i>
              ${p.type === 'tool' ? 'Buka Tool' : 'Buka Proyek'}
            </a>
          ` : `
            <button class="btn btn-sm btn-secondary btn-disabled" disabled>
              <i data-lucide="clock" style="width:14px;height:14px;"></i> Segera Hadir
            </button>
          `}

          ${p.repository ? `
            <a href="${Utils.escapeHtml(p.repository)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline" title="Lihat Source Code Repository">
              <i data-lucide="git-branch" style="width:14px;height:14px;"></i> Code
            </a>
          ` : ''}
        </div>
      </div>
    `;
  },

  renderSkillsList() {
    const container = document.getElementById('skillsGridContainer');
    if (!container) return;

    container.innerHTML = this.skills.map(s => `
      <div class="card card-hover">
        <h3 style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <i data-lucide="${Utils.escapeHtml(s.icon || 'code')}" style="color:var(--primary);"></i> ${Utils.escapeHtml(s.category)}
        </h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:16px;">${Utils.escapeHtml(s.description)}</p>

        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${s.items.map(item => `
            <span class="badge badge-secondary" style="padding:6px 12px;font-size:0.82rem;">
              <i data-lucide="${Utils.escapeHtml(item.icon || 'check')}" style="width:14px;height:14px;color:var(--primary);"></i>
              ${Utils.escapeHtml(item.name)}
            </span>
          `).join('')}
        </div>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
  },

  renderCertifications() {
    const container = document.getElementById('certificationsContainer');
    if (!container || !this.experience.certifications) return;

    container.innerHTML = this.experience.certifications.map(c => {
      const hasUrl = c.credentialUrl && c.credentialUrl.trim() !== '';
      const cardInnerHtml = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <span class="badge badge-primary"><i data-lucide="award"></i> ${Utils.escapeHtml(c.issuer)}</span>
          <span class="font-mono" style="font-size:0.8rem;color:var(--text-muted);">${Utils.escapeHtml(c.year)}</span>
        </div>
        <h3 style="font-size:1.1rem;margin-bottom:6px;color:var(--text-primary);">${Utils.escapeHtml(c.title)}</h3>
        <p style="font-size:0.88rem;color:var(--text-secondary);margin-bottom:12px;line-height:1.5;">${Utils.escapeHtml(c.description)}</p>
        ${hasUrl ? `
          <div style="display:flex;align-items:center;justify-content:flex-end;gap:6px;margin-top:auto;padding-top:10px;font-size:0.82rem;font-weight:600;color:var(--primary);">
            <span>${Utils.escapeHtml(c.verifyText || 'Lihat Sertifikat Resmi')}</span>
            <i data-lucide="external-link" style="width:14px;height:14px;"></i>
          </div>
        ` : ''}
      `;

      if (hasUrl) {
        return `
          <a href="${Utils.escapeHtml(c.credentialUrl)}" 
             target="_blank" 
             rel="noopener noreferrer" 
             aria-label="Lihat sertifikat ${Utils.escapeHtml(c.title)}" 
             class="card card-hover cert-card-link" 
             style="display:flex;flex-direction:column;">
            ${cardInnerHtml}
          </a>
        `;
      } else {
        return `
          <div class="card card-hover" style="display:flex;flex-direction:column;">
            ${cardInnerHtml}
          </div>
        `;
      }
    }).join('');

    if (window.lucide) lucide.createIcons();
  }
};
