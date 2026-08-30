"use client";

import { useState } from "react";
import { projectsData } from "@/data/projects";
import ProjectCard from "@/components/cards/ProjectCard";
import { Search, X } from "lucide-react";
import styles from "./Projects.module.css";

const categories = ["all", "Networking", "Web Development", "Pendidikan", "Personal"] as const;

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projectsData.filter((project) => {
    const matchesCategory =
      selectedCategory === "all" ||
      project.category.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      project.title.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q) ||
      project.tags.some((tag) => tag.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (cat: string) => {
    if (cat === "all") return projectsData.length;
    return projectsData.filter(
      (p) => p.category.toLowerCase() === cat.toLowerCase()
    ).length;
  };

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <div className="sectionHeader">
          <span className="sectionBadge">
            Perpustakaan Karya
          </span>
          <h2 id="projects-title" className="sectionTitle">
            Semua Proyek Unggulan
          </h2>
          <p className="sectionDescription">
            Jelajahi seluruh proyek infrastruktur jaringan, simulasi Packet Tracer, dan pengembangan software yang telah saya bangun.
          </p>
        </div>

        {/* Toolbar Filter & Search */}
        <div className={styles.toolbar}>
          {/* Search Input Bar */}
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama proyek, deskripsi, atau tag..."
              className={styles.searchInput}
              aria-label="Cari proyek"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className={styles.clearSearchBtn}
                aria-label="Hapus pencarian"
                title="Hapus pencarian"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Clean Category Filter Pills */}
          <div className={styles.filterBarWrapper}>
            <div
              className={styles.filterBar}
              role="tablist"
              aria-label="Kategori Proyek"
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                const count = getCategoryCount(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    aria-pressed={isActive}
                    className={`${styles.filterPill} ${
                      isActive ? styles.filterPillActive : ""
                    }`}
                  >
                    <span>{cat === "all" ? "Semua Kategori" : cat}</span>
                    <span className={styles.filterCount}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {searchQuery && (
            <p className={styles.resultCount}>
              Menampilkan {filteredProjects.length} hasil untuk &quot;{searchQuery}&quot;
            </p>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-md)",
              border: "1px dashed var(--color-border)",
              color: "var(--color-text-muted)",
            }}
          >
            Proyek tidak ditemukan. Cobalah kata kunci lain.
          </div>
        ) : (
          <div className="cardsGrid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
