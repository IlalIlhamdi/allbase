"use client";

import { useState } from "react";
import { convertMbpsToMBps, convertMBpsToMbps, convertNumberBases } from "@/lib/network";
import { Binary, Zap, Repeat, RotateCcw, Copy, CheckCircle } from "lucide-react";

export default function NetworkConverter() {
  const [activeTab, setActiveTab] = useState<"speed" | "bases">("speed");

  // Speed Converter State
  const [mbps, setMbps] = useState<string>("100");
  const [mBps, setMBps] = useState<string>("12.5");

  // Bases Converter State
  const [decNumber, setDecNumber] = useState<string>("192");

  const [copied, setCopied] = useState(false);

  const handleMbpsChange = (val: string) => {
    setMbps(val);
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) {
      setMBps("");
      return;
    }
    setMBps(convertMbpsToMBps(num).toString());
  };

  const handleMBpsChange = (val: string) => {
    setMBps(val);
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) {
      setMbps("");
      return;
    }
    setMbps(convertMBpsToMbps(num).toString());
  };

  const resetSpeedForm = () => {
    setMbps("100");
    setMBps("12.5");
  };

  const copySpeedResult = () => {
    const text = `${mbps || 0} Mbps = ${mBps || 0} MB/s`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const baseResults = convertNumberBases(decNumber);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px", marginInline: "auto" }}>
      {/* Header Card */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "28px 24px",
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
            <Binary size={14} /> Network Tool
          </span>
          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
            1 Byte = 8 bit
          </span>
        </div>

        <h1 style={{ fontSize: "1.6rem", marginBottom: "6px" }}>Konversi Satuan Jaringan</h1>
        <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", marginBottom: "24px" }}>
          Konversikan kecepatan bandwidth (Mbps ke MB/s) dan format bilangan desimal, biner, serta heksadesimal secara real-time.
        </p>

        {/* Converter Tabs */}
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--color-border)", paddingBottom: "12px" }}>
          <button
            onClick={() => setActiveTab("speed")}
            aria-pressed={activeTab === "speed"}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              fontWeight: 600,
              fontSize: "0.88rem",
              backgroundColor: activeTab === "speed" ? "var(--color-primary-600)" : "var(--color-surface-soft)",
              color: activeTab === "speed" ? "#ffffff" : "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              transition: "all var(--transition-fast)",
            }}
          >
            <Zap size={14} style={{ display: "inline", marginRight: "6px" }} /> Mbps ke MB/s
          </button>

          <button
            onClick={() => setActiveTab("bases")}
            aria-pressed={activeTab === "bases"}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              fontWeight: 600,
              fontSize: "0.88rem",
              backgroundColor: activeTab === "bases" ? "var(--color-primary-600)" : "var(--color-surface-soft)",
              color: activeTab === "bases" ? "#ffffff" : "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              transition: "all var(--transition-fast)",
            }}
          >
            <Binary size={14} style={{ display: "inline", marginRight: "6px" }} /> Desimal / Biner / Hex
          </button>
        </div>
      </div>

      {/* Tab 1: Mbps to MB/s */}
      {activeTab === "speed" && (
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div>
              <label htmlFor="mbpsInput" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Kecepatan ISP (Mbps - Megabit/s) *
              </label>
              <input
                id="mbpsInput"
                type="number"
                value={mbps}
                onChange={(e) => handleMbpsChange(e.target.value)}
                placeholder="100"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary-50)",
                  color: "var(--color-primary-600)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Repeat size={20} />
              </div>
            </div>

            <div>
              <label htmlFor="mBpsInput" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Kecepatan Download (MB/s - Megabyte/s) *
              </label>
              <input
                id="mBpsInput"
                type="number"
                value={mBps}
                onChange={(e) => handleMBpsChange(e.target.value)}
                placeholder="12.5"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
            <button
              onClick={resetSpeedForm}
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
              <RotateCcw size={16} /> Reset
            </button>

            <button
              onClick={copySpeedResult}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text-primary)",
                fontWeight: 600,
                fontSize: "0.92rem",
              }}
            >
              {copied ? <CheckCircle size={16} color="var(--color-success)" /> : <Copy size={16} />}
              {copied ? "Hasil Disalin!" : "Salin Hasil"}
            </button>
          </div>

          {/* Result Preview Box */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "var(--color-surface-soft)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Hasil Konversi Kecepatan</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--color-primary-600)" }}>
              {mbps || 0} Mbps = {mBps || 0} MB/s
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Decimal / Binary / Hex */}
      {activeTab === "bases" && (
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "24px",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="decInput" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
              Angka Desimal *
            </label>
            <input
              id="decInput"
              type="number"
              value={decNumber}
              onChange={(e) => setDecNumber(e.target.value)}
              placeholder="192"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
                fontFamily: "var(--font-mono)",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              fontFamily: "var(--font-mono)",
            }}
          >
            <div
              style={{
                padding: "16px",
                backgroundColor: "var(--color-surface-soft)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Format Biner (8-bit)</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-primary-600)" }}>
                {baseResults.binary}
              </div>
            </div>

            <div
              style={{
                padding: "16px",
                backgroundColor: "var(--color-surface-soft)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Format Heksadesimal</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-success)" }}>
                {baseResults.hex}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
