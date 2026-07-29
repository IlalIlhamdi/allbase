"use client";

import { useState, useEffect } from "react";
import { CheckSquare, PlusCircle, RotateCcw, Check, Edit3, Trash2, Search } from "lucide-react";

export interface TaskItem {
  id: string;
  course: string;
  meeting?: string;
  givenDate?: string;
  deadline: string;
  priority: "Tinggi" | "Sedang" | "Rendah";
  desc: string;
  completed: boolean;
  createdAt: string;
}

const STORAGE_KEY = "allbase-college-tasks";

function generateTaskId(courseName: string): string {
  const clean = courseName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `task_${clean}_${Date.parse(new Date().toISOString())}`;
}

export default function CollegeTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [course, setCourse] = useState("");
  const [meeting, setMeeting] = useState("");
  const [givenDate, setGivenDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<"Tinggi" | "Sedang" | "Rendah">("Sedang");
  const [desc, setDesc] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed: TaskItem[] = saved ? JSON.parse(saved) : [];
      const todayStr = new Date().toISOString().split("T")[0] || "";
      requestAnimationFrame(() => {
        setTasks(parsed);
        setGivenDate(todayStr);
      });
    } catch {
      requestAnimationFrame(() => {
        setTasks([]);
      });
    }
  }, []);

  const saveTasks = (newTasks: TaskItem[]) => {
    setTasks(newTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
  };

  const calculateDaysLeft = (deadlineStr: string) => {
    if (!deadlineStr) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dl = new Date(deadlineStr);
    dl.setHours(0, 0, 0, 0);
    return Math.ceil((dl.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course.trim() || !deadline || !desc.trim()) return;

    if (editId) {
      const updated = tasks.map((t) =>
        t.id === editId ? { ...t, course, meeting, givenDate, deadline, priority, desc } : t
      );
      saveTasks(updated);
    } else {
      const newTask: TaskItem = {
        id: generateTaskId(course),
        course: course.trim(),
        meeting: meeting.trim(),
        givenDate,
        deadline,
        priority,
        desc: desc.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      saveTasks([...tasks, newTask]);
    }

    resetForm();
  };

  const resetForm = () => {
    setEditId(null);
    setCourse("");
    setMeeting("");
    setGivenDate(new Date().toISOString().split("T")[0] || "");
    setDeadline("");
    setPriority("Sedang");
    setDesc("");
  };

  const toggleComplete = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    saveTasks(updated);
  };

  const editTask = (t: TaskItem) => {
    setEditId(t.id);
    setCourse(t.course);
    setMeeting(t.meeting || "");
    setGivenDate(t.givenDate || "");
    setDeadline(t.deadline || "");
    setPriority(t.priority || "Sedang");
    setDesc(t.desc);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteTask = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tugas ini?")) return;
    saveTasks(tasks.filter((t) => t.id !== id));
  };

  const formatText = (type: "upper" | "capitalize" | "title") => {
    if (!desc) return;
    if (type === "upper") setDesc(desc.toUpperCase());
    if (type === "capitalize") setDesc(desc.charAt(0).toUpperCase() + desc.slice(1).toLowerCase());
    if (type === "title")
      setDesc(desc.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()));
  };

  const filteredTasks = tasks.filter((t) => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || t.course.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
    if (!matchesSearch) return false;

    if (statusFilter === "pending") return !t.completed;
    if (statusFilter === "completed") return t.completed;
    if (statusFilter === "urgent") return !t.completed && calculateDaysLeft(t.deadline) <= 3;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Task Form Card */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "32px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
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
            <CheckSquare size={14} /> Form Catatan Tugas
          </span>
          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Penyimpanan Lokal Browser</span>
        </div>

        <h1 style={{ fontSize: "1.6rem", marginBottom: "6px" }}>
          {editId ? "Edit Tugas Kuliah" : "Tambah Tugas Kuliah"}
        </h1>
        <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", marginBottom: "24px" }}>
          Catat tugas perkuliahan, atur deadline, dan pantau prioritas pengerjaan tugas Anda.
        </p>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label htmlFor="courseInput" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Mata Kuliah *
              </label>
              <input
                id="courseInput"
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="Contoh: Jaringan Komputer"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontSize: "1rem",
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="meetingInput" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Pertemuan Ke-
              </label>
              <input
                id="meetingInput"
                type="text"
                value={meeting}
                onChange={(e) => setMeeting(e.target.value)}
                placeholder="Contoh: Pertemuan 4"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label htmlFor="givenDateInput" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Tanggal Diberikan
              </label>
              <input
                id="givenDateInput"
                type="date"
                value={givenDate}
                onChange={(e) => setGivenDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div>
              <label htmlFor="deadlineInput" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Deadline Dikumpulkan *
              </label>
              <input
                id="deadlineInput"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontSize: "1rem",
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="prioritySelect" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Prioritas
              </label>
              <select
                id="prioritySelect"
                value={priority}
                onChange={(e) => setPriority(e.target.value as "Tinggi" | "Sedang" | "Rendah")}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontSize: "1rem",
                }}
              >
                <option value="Tinggi">Tinggi (High)</option>
                <option value="Sedang">Sedang (Medium)</option>
                <option value="Rendah">Rendah (Low)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
              <label htmlFor="descTextarea" style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                Deskripsi &amp; Rincian Tugas *
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => formatText("upper")}
                  style={{
                    padding: "4px 8px",
                    fontSize: "0.75rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  UPPER
                </button>
                <button
                  type="button"
                  onClick={() => formatText("capitalize")}
                  style={{
                    padding: "4px 8px",
                    fontSize: "0.75rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Capitalize
                </button>
                <button
                  type="button"
                  onClick={() => formatText("title")}
                  style={{
                    padding: "4px 8px",
                    fontSize: "0.75rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Title
                </button>
              </div>
            </div>
            <textarea
              id="descTextarea"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Tuliskan petunjuk tugas, soal, atau catatan pengerjaan..."
              rows={4}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
                fontSize: "1rem",
              }}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="submit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--color-primary-600)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "0.92rem",
              }}
            >
              <PlusCircle size={16} /> {editId ? "Update Tugas" : "Simpan Tugas"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--color-surface-soft)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                fontWeight: 600,
                fontSize: "0.92rem",
              }}
            >
              <RotateCcw size={16} /> Reset Form
            </button>
          </div>
        </form>
      </div>

      {/* Task Filters & List */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h2 style={{ fontSize: "1.3rem" }}>Daftar Tugas Kuliah ({filteredTasks.length})</h2>
        <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
          Data tersimpan secara lokal pada browser ini.
        </span>
      </div>

      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "16px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
        }}
      >
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari mata kuliah..."
            style={{
              width: "100%",
              padding: "10px 14px 10px 42px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
              fontSize: "0.9rem",
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
            fontSize: "0.9rem",
          }}
        >
          <option value="all">Semua Status</option>
          <option value="pending">Belum Selesai</option>
          <option value="completed">Selesai</option>
          <option value="urgent">Deadline Terdekat (&lt;= 3 Hari)</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
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
          Belum ada tugas yang cocok.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {filteredTasks.map((t) => {
            const daysLeft = calculateDaysLeft(t.deadline);
            return (
              <div
                key={t.id}
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  opacity: t.completed ? 0.75 : 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", textDecoration: t.completed ? "line-through" : "none" }}>{t.course}</h3>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{t.meeting || "Tugas"}</span>
                  </div>

                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "var(--radius-pill)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      backgroundColor:
                        t.priority === "Tinggi"
                          ? "var(--color-danger-soft)"
                          : t.priority === "Sedang"
                          ? "var(--color-warning-soft)"
                          : "var(--color-surface-soft)",
                      color:
                        t.priority === "Tinggi"
                          ? "var(--color-danger)"
                          : t.priority === "Sedang"
                          ? "var(--color-warning)"
                          : "var(--color-text-muted)",
                    }}
                  >
                    {t.priority}
                  </span>
                </div>

                <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>{t.desc}</p>

                <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid var(--color-border)" }}>
                  <span>Diberikan: {t.givenDate || "-"}</span>
                  <span>
                    Deadline: <strong>{t.deadline}</strong> ({daysLeft < 0 ? `Lewat ${Math.abs(daysLeft)} hari` : `${daysLeft} hari lagi`})
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                  <button
                    onClick={() => toggleComplete(t.id)}
                    style={{
                      flex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: t.completed ? "var(--color-surface-soft)" : "var(--color-primary-600)",
                      color: t.completed ? "var(--color-text-primary)" : "#ffffff",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <Check size={14} /> {t.completed ? "Batal Selesai" : "Tandai Selesai"}
                  </button>

                  <button
                    onClick={() => editTask(t)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border)",
                    }}
                    title="Edit Tugas"
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    onClick={() => deleteTask(t.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-danger)",
                    }}
                    title="Hapus Tugas"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
