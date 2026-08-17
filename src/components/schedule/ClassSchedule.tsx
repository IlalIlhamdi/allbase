"use client";

import { useState } from "react";
import { scheduleData, studentList } from "@/data/schedule";
import { Calendar, MapPin, User, Search, Users } from "lucide-react";

const daysKey = ["senin", "selasa", "rabu", "kamis", "jumat"];
const daysName = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export default function ClassSchedule() {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"jadwal" | "daftar">("jadwal");
  const [search, setSearch] = useState("");

  const filteredStudents = studentList.filter(
    (s) =>
      !search ||
      s.nm.toLowerCase().includes(search.toLowerCase()) ||
      s.id.includes(search)
  );

  const currentDayKey = daysKey[selectedDay] || "senin";
  const classes = scheduleData[currentDayKey] || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* App Bar Header */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "clamp(18px, 4vw, 24px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "var(--radius-pill)",
              fontSize: "0.75rem",
              fontWeight: 600,
              backgroundColor: "var(--color-primary-50)",
              color: "var(--color-primary-600)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Calendar size={14} /> TRJT 2A · Semester 4
          </span>
          <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 1.8rem)", marginTop: "4px" }}>Jadwal Perkuliahan Roster</h1>
        </div>

        {/* Tab Switchers */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("jadwal")}
            style={{
              padding: "8px 16px",
              minHeight: "44px",
              borderRadius: "var(--radius-sm)",
              fontWeight: 600,
              fontSize: "0.88rem",
              backgroundColor: activeTab === "jadwal" ? "var(--color-primary-600)" : "var(--color-surface-soft)",
              color: activeTab === "jadwal" ? "#ffffff" : "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <Calendar size={14} style={{ display: "inline", marginRight: "6px" }} /> Jadwal
          </button>
          <button
            onClick={() => setActiveTab("daftar")}
            style={{
              padding: "8px 16px",
              minHeight: "44px",
              borderRadius: "var(--radius-sm)",
              fontWeight: 600,
              fontSize: "0.88rem",
              backgroundColor: activeTab === "daftar" ? "var(--color-primary-600)" : "var(--color-surface-soft)",
              color: activeTab === "daftar" ? "#ffffff" : "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <Users size={14} style={{ display: "inline", marginRight: "6px" }} /> Daftar Mahasiswa
          </button>
        </div>
      </div>

      {activeTab === "jadwal" && (
        <>
          {/* Day Pills */}
          <div className="filterScroll">
            {daysName.map((day, idx) => (
              <button
                key={day}
                onClick={() => setSelectedDay(idx)}
                style={{
                  padding: "10px 20px",
                  minHeight: "44px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  backgroundColor: selectedDay === idx ? "var(--color-primary-600)" : "var(--color-surface)",
                  color: selectedDay === idx ? "#ffffff" : "var(--color-text-primary)",
                  border: "1px solid var(--color-border)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Schedule Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {classes.length === 0 ? (
              <div
                style={{
                  padding: "32px",
                  textAlign: "center",
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "var(--radius-md)",
                  border: "1px dashed var(--color-border)",
                  color: "var(--color-text-muted)",
                }}
              >
                Tidak ada kelas pada hari {daysName[selectedDay]}.
              </div>
            ) : (
              classes.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    padding: "clamp(16px, 3vw, 20px)",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 100px), 1fr))",
                    gap: "16px",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "12px",
                      backgroundColor: "var(--color-primary-50)",
                      borderRadius: "var(--radius-sm)",
                      color: "var(--color-primary-600)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{item.jam}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{item.sel}</div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>{item.mk}</h3>
                    <div style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <User size={14} color="var(--color-primary-600)" /> {item.dosen}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <MapPin size={14} /> {item.ruang} • {item.gedung}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === "daftar" && (
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "clamp(18px, 4vw, 24px)",
          }}
        >
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama mahasiswa atau NIM..."
              style={{
                width: "100%",
                padding: "12px 14px 12px 42px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
                fontSize: "1rem",
              }}
            />
          </div>

          <div className="tableWrapper">
            <table style={{ minWidth: "480px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-border)", textAlign: "left" }}>
                  <th style={{ padding: "12px", fontSize: "0.85rem" }}>No</th>
                  <th style={{ padding: "12px", fontSize: "0.85rem" }}>NIM</th>
                  <th style={{ padding: "12px", fontSize: "0.85rem" }}>Nama Lengkap</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((m) => (
                  <tr key={m.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "12px", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>{m.no}</td>
                    <td style={{ padding: "12px", fontSize: "0.9rem", fontFamily: "var(--font-mono)", color: "var(--color-primary-600)" }}>{m.id}</td>
                    <td style={{ padding: "12px", fontSize: "0.9rem", fontWeight: 600 }}>{m.nm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
