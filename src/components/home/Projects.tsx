"use client";

import { useState } from "react";
import { projectsData } from "@/data/projects";
import ProjectCard from "@/components/cards/ProjectCard";
import { Search } from "lucide-react";

const categories = ["all", "Networking", "Web Development", "Pendidikan", "Personal"];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projectsData.filter((project) => {
    const matchesCategory =
      selectedCategory === "all" || project.category.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      project.title.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q) ||
      project.tags.some((tag) => tag.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 40px)" }}>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "var(--radius-pill)",
              backgroundColor: "var(--color-primary-50)",
              color: "var(--color-primary-600)",
              fontSize: "0.82rem",
              fontWeight: 600,
              display: "inline-block",
              marginBottom: "12px",
              border: "1px solid var(--color-border)",
            }}
          >
            Perpustakaan Karya
          </span>
          <h2 id="projects-title" className="sectionTitle">
            Semua Proyek Saya
          </h2>
          <p className="sectionDescription">
            Jelajahi seluruh proyek yang telah dan sedang saya kembangkan.
          </p>
        </div>

        {/* Toolbar Filter & Search */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "36px" }}>
          <div
            style={{
              position: "relative",
              maxWidth: "500px",
              marginInline: "auto",
              width: "100%",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-muted)",
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama proyek, deskripsi, atau tag..."
              style={{
                width: "100%",
                padding: "12px 16px 12px 42px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
                fontSize: "1rem",
                color: "var(--color-text-primary)",
              }}
            />
          </div>

          <div
            className="filterScroll"
            style={{
              justifyContent: "center",
              flexWrap: "wrap",
            }}
            role="tablist"
            aria-label="Kategori Proyek"
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={isActive}
                  style={{
                    padding: "8px 18px",
                    minHeight: "44px",
                    borderRadius: "var(--radius-pill)",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    border: "1px solid var(--color-border)",
                    backgroundColor: isActive ? "var(--color-primary-600)" : "var(--color-surface)",
                    color: isActive ? "#ffffff" : "var(--color-text-primary)",
                    transition: "all var(--transition-fast)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat === "all" ? "Semua Kategori" : cat}
                </button>
              );
            })}
          </div>
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
