"use client";

import { useState, useId } from "react";
import Link from "next/link";
import {
  Binary,
  Zap,
  Repeat,
  RotateCcw,
  Copy,
  CheckCircle2,
  Share2,
  ChevronLeft,
  ArrowRightLeft,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import {
  convertMbpsToMBps,
  convertMBpsToMbps,
  convertNumberBases,
  convertBinaryToDecimal,
  convertAllBandwidthUnits,
  ipToBinaryString,
  binaryStringToIp,
  maskToPrefix,
  prefixToMask,
  isValidIPv4,
  BandwidthUnit,
} from "@/lib/network";
import { useToast } from "@/components/providers/ToastProvider";
import { useRecentTools } from "@/hooks/useRecentTools";

type TabKey = "speed" | "bandwidth" | "bases" | "ipBinary" | "maskCidr";

export default function NetworkConverter() {
  const [activeTab, setActiveTab] = useState<TabKey>("speed");

  // Tab 1: Speed Mbps <-> MB/s
  const [mbps, setMbps] = useState<string>("100");
  const [mBps, setMBps] = useState<string>("12.5");

  // Tab 2: Full Bandwidth Units Converter
  const [bwValue, setBwValue] = useState<string>("100");
  const [bwUnit, setBwUnit] = useState<"bps" | "Kbps" | "Mbps" | "Gbps" | "Tbps" | "B/s" | "KB/s" | "MB/s" | "GB/s" | "TB/s">("Mbps");

  // Tab 3: Number Bases (Decimal <-> Binary <-> Hex)
  const [decInput, setDecInput] = useState<string>("192");
  const [binInput, setBinInput] = useState<string>("11000000");

  // Tab 4: IPv4 <-> Binary 32-bit
  const [ipv4Input, setIpv4Input] = useState<string>("192.168.1.1");
  const [ipBinaryInput, setIpBinaryInput] = useState<string>("11000000.10101000.00000001.00000001");

  // Tab 5: Mask <-> CIDR
  const [maskInput, setMaskInput] = useState<string>("255.255.255.0");
  const [cidrInput, setCidrInput] = useState<number>(24);

  const [copied, setCopied] = useState(false);
  const { success, error: toastError } = useToast();
  const { addRecentTool } = useRecentTools();

  useState(() => {
    addRecentTool("network-converter-tool");
  });

  // Handlers for Tab 1: Mbps <-> MB/s
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

  // Handlers for Tab 3: Number Bases
  const handleDecChange = (val: string) => {
    setDecInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      setBinInput(num.toString(2));
    }
  };

  const handleBinChange = (val: string) => {
    const cleanBin = val.replace(/[^01]/g, "");
    setBinInput(cleanBin);
    const dec = convertBinaryToDecimal(cleanBin);
    if (dec !== null) {
      setDecInput(dec.toString());
    }
  };

  // Handlers for Tab 4: IPv4 <-> 32-bit Binary
  const handleIpv4Change = (val: string) => {
    setIpv4Input(val);
    if (isValidIPv4(val.trim())) {
      const bin = ipToBinaryString(val.trim());
      if (bin) setIpBinaryInput(bin);
    }
  };

  const handleIpBinaryChange = (val: string) => {
    setIpBinaryInput(val);
    const ip = binaryStringToIp(val.trim());
    if (ip) setIpv4Input(ip);
  };

  // Handlers for Tab 5: Mask <-> CIDR
  const handleMaskChange = (val: string) => {
    setMaskInput(val);
    const prefix = maskToPrefix(val.trim());
    if (prefix !== null) {
      setCidrInput(prefix);
    }
  };

  const handleCidrChange = (val: number) => {
    setCidrInput(val);
    setMaskInput(prefixToMask(val));
  };

  // Copy Result Function
  const handleCopyResult = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    success("Hasil konversi berhasil disalin!");
    setTimeout(() => setCopied(false), 2500);
  };

  // Share Result Function
  const handleShare = async () => {
    let text = "";
    if (activeTab === "speed") {
      text = `Konversi Kecepatan: ${mbps || 0} Mbps = ${mBps || 0} MB/s (via ALLBASE)`;
    } else if (activeTab === "bases") {
      text = `Konversi Bilangan: Desimal ${decInput} = Biner ${binInput} (via ALLBASE)`;
    } else if (activeTab === "ipBinary") {
      text = `IPv4 ke Biner: ${ipv4Input} = ${ipBinaryInput} (via ALLBASE)`;
    } else {
      text = `Subnet Mask ke CIDR: ${maskInput} = /${cidrInput} (via ALLBASE)`;
    }

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Hasil Konversi Satuan Jaringan ALLBASE",
          text,
          url: window.location.href,
        });
      } catch {
        handleCopyResult(text);
      }
    } else {
      handleCopyResult(text);
    }
  };

  const baseResults = convertNumberBases(decInput);
  const bwResults = convertAllBandwidthUnits(parseFloat(bwValue) || 0, bwUnit as BandwidthUnit);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "900px", marginInline: "auto" }}>
      {/* Top Toolbar Navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <Link
          href="/#tools"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            minHeight: "44px",
            color: "var(--color-text-secondary)",
            fontSize: "0.88rem",
            fontWeight: 600,
          }}
          aria-label="Kembali ke Daftar Tools"
        >
          <ChevronLeft size={18} /> Tools
        </Link>
        <button
          type="button"
          onClick={handleShare}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            minHeight: "40px",
            padding: "6px 14px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
            color: "var(--color-text-primary)",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
          title="Bagikan Hasil"
        >
          <Share2 size={15} /> Bagikan
        </button>
      </div>

      {/* Header & Mode Switcher Card */}
      <div className="baseCard" style={{ padding: "clamp(20px, 4vw, 32px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
          <span className="sectionBadge" style={{ margin: 0 }}>
            <Binary size={14} /> Network Converter Engine
          </span>
          <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
            1 Byte = 8 bits
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 1.85rem)", fontWeight: 800, marginBottom: "8px" }}>
          Konversi Satuan Jaringan
        </h1>
        <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
          Utilitas konversi dua arah yang presisi untuk bandwidth, Mbps ke MB/s, representasi biner IPv4 32-bit, sistem bilangan desimal/hex, dan prefix CIDR.
        </p>

        {/* Tab Navigation Segmented Pills */}
        <div className="filterScroll" role="tablist" aria-label="Pilihan Mode Konversi">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "speed"}
            onClick={() => setActiveTab("speed")}
            style={{
              padding: "8px 16px",
              minHeight: "44px",
              borderRadius: "var(--radius-pill)",
              fontWeight: 600,
              fontSize: "0.88rem",
              backgroundColor: activeTab === "speed" ? "var(--color-primary-600)" : "var(--color-surface-soft)",
              color: activeTab === "speed" ? "#ffffff" : "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Zap size={14} style={{ display: "inline", marginRight: "6px" }} /> Mbps ↔ MB/s
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "bandwidth"}
            onClick={() => setActiveTab("bandwidth")}
            style={{
              padding: "8px 16px",
              minHeight: "44px",
              borderRadius: "var(--radius-pill)",
              fontWeight: 600,
              fontSize: "0.88rem",
              backgroundColor: activeTab === "bandwidth" ? "var(--color-primary-600)" : "var(--color-surface-soft)",
              color: activeTab === "bandwidth" ? "#ffffff" : "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Layers size={14} style={{ display: "inline", marginRight: "6px" }} /> Satuan Bandwidth Lengkap
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "bases"}
            onClick={() => setActiveTab("bases")}
            style={{
              padding: "8px 16px",
              minHeight: "44px",
              borderRadius: "var(--radius-pill)",
              fontWeight: 600,
              fontSize: "0.88rem",
              backgroundColor: activeTab === "bases" ? "var(--color-primary-600)" : "var(--color-surface-soft)",
              color: activeTab === "bases" ? "#ffffff" : "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Binary size={14} style={{ display: "inline", marginRight: "6px" }} /> Desimal ↔ Biner ↔ Hex
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "ipBinary"}
            onClick={() => setActiveTab("ipBinary")}
            style={{
              padding: "8px 16px",
              minHeight: "44px",
              borderRadius: "var(--radius-pill)",
              fontWeight: 600,
              fontSize: "0.88rem",
              backgroundColor: activeTab === "ipBinary" ? "var(--color-primary-600)" : "var(--color-surface-soft)",
              color: activeTab === "ipBinary" ? "#ffffff" : "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <ArrowRightLeft size={14} style={{ display: "inline", marginRight: "6px" }} /> IPv4 ↔ 32-bit Biner
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "maskCidr"}
            onClick={() => setActiveTab("maskCidr")}
            style={{
              padding: "8px 16px",
              minHeight: "44px",
              borderRadius: "var(--radius-pill)",
              fontWeight: 600,
              fontSize: "0.88rem",
              backgroundColor: activeTab === "maskCidr" ? "var(--color-primary-600)" : "var(--color-surface-soft)",
              color: activeTab === "maskCidr" ? "#ffffff" : "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Sparkles size={14} style={{ display: "inline", marginRight: "6px" }} /> Subnet Mask ↔ CIDR
          </button>
        </div>
      </div>

      {/* TAB 1: Mbps <-> MB/s */}
      {activeTab === "speed" && (
        <div className="baseCard" style={{ padding: "clamp(20px, 4vw, 32px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Zap size={20} color="var(--color-primary-600)" />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Konverter Kecepatan ISP vs Unduh</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: "20px",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div>
              <label htmlFor="mbpsInput" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Kecepatan ISP (Mbps — Megabit/detik) *
              </label>
              <input
                id="mbpsInput"
                type="number"
                step="any"
                min="0"
                value={mbps}
                onChange={(e) => handleMbpsChange(e.target.value)}
                placeholder="Contoh: 100"
                className="inputField"
                style={{ fontFamily: "var(--font-mono)" }}
              />
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                Kecepatan yang diiklankan oleh ISP (bit)
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => {
                  const temp = mbps;
                  handleMbpsChange(mBps);
                  setMBps(temp);
                }}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary-50)",
                  color: "var(--color-primary-600)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                title="Tukar Posisi"
                aria-label="Tukar Posisi"
              >
                <Repeat size={18} />
              </button>
            </div>

            <div>
              <label htmlFor="mBpsInput" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Kecepatan Download Nyata (MB/s — Megabyte/detik) *
              </label>
              <input
                id="mBpsInput"
                type="number"
                step="any"
                min="0"
                value={mBps}
                onChange={(e) => handleMBpsChange(e.target.value)}
                placeholder="Contoh: 12.5"
                className="inputField"
                style={{ fontFamily: "var(--font-mono)" }}
              />
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                Kecepatan transfer file pada browser/IDM (Byte)
              </span>
            </div>
          </div>

          {/* Quick Presets */}
          <div style={{ marginBottom: "20px" }}>
            <span style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-muted)", marginBottom: "8px" }}>
              Paket Internet Populer:
            </span>
            <div className="filterScroll">
              {[20, 30, 50, 100, 200, 500, 1000].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => handleMbpsChange(speed.toString())}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-pill)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    backgroundColor: "var(--color-surface-soft)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-primary)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {speed} Mbps ({convertMbpsToMBps(speed)} MB/s)
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            <button
              type="button"
              onClick={() => {
                setMbps("100");
                setMBps("12.5");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                minHeight: "44px",
                padding: "10px 20px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--color-surface-soft)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                fontWeight: 600,
                fontSize: "0.92rem",
                flex: "1 1 120px",
                cursor: "pointer",
              }}
            >
              <RotateCcw size={16} /> Reset
            </button>

            <button
              type="button"
              onClick={() => handleCopyResult(`${mbps || 0} Mbps = ${mBps || 0} MB/s`)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                minHeight: "44px",
                padding: "10px 20px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text-primary)",
                fontWeight: 600,
                fontSize: "0.92rem",
                cursor: "pointer",
                flex: "1 1 140px",
              }}
            >
              {copied ? <CheckCircle2 size={16} color="var(--color-success)" /> : <Copy size={16} />}
              {copied ? "Disalin!" : "Salin Hasil"}
            </button>
          </div>

          <div
            style={{
              padding: "16px 20px",
              backgroundColor: "var(--color-surface-soft)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "6px" }}>
              <Info size={16} color="var(--color-primary-600)" />
              <strong>Rumus Perhitungan:</strong>
            </div>
            <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
              Karena <strong>1 Byte = 8 bits</strong>, maka <strong>MB/s = Mbps ÷ 8</strong>. File 1 GB (1000 MB) pada koneksi 100 Mbps (12.5 MB/s) akan selesai diunduh dalam waktu sekitar ~80 detik (dalam kondisi ideal).
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: Full Bandwidth Units */}
      {activeTab === "bandwidth" && (
        <div className="baseCard" style={{ padding: "clamp(20px, 4vw, 32px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Layers size={20} color="var(--color-primary-600)" />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Konversi Seluruh Satuan Bandwidth</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div>
              <label htmlFor="bwValInput" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Nilai *
              </label>
              <input
                id="bwValInput"
                type="number"
                step="any"
                min="0"
                value={bwValue}
                onChange={(e) => setBwValue(e.target.value)}
                className="inputField"
                style={{ fontFamily: "var(--font-mono)" }}
              />
            </div>

            <div>
              <label htmlFor="bwUnitSelect" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Satuan Asal *
              </label>
              <select
                id="bwUnitSelect"
                className="inputField"
                value={bwUnit}
                onChange={(e) => setBwUnit(e.target.value as any)}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <optgroup label="Satuan Bit (ISP / Jaringan)">
                  <option value="bps">bps (bits per second)</option>
                  <option value="Kbps">Kbps (Kilobits per second)</option>
                  <option value="Mbps">Mbps (Megabits per second)</option>
                  <option value="Gbps">Gbps (Gigabits per second)</option>
                  <option value="Tbps">Tbps (Terabits per second)</option>
                </optgroup>
                <optgroup label="Satuan Byte (Penyimpanan / Unduh)">
                  <option value="B/s">B/s (Bytes per second)</option>
                  <option value="KB/s">KB/s (Kilobytes per second)</option>
                  <option value="MB/s">MB/s (Megabytes per second)</option>
                  <option value="GB/s">GB/s (Gigabytes per second)</option>
                  <option value="TB/s">TB/s (Terabytes per second)</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
              gap: "12px",
              fontFamily: "var(--font-mono)",
              marginBottom: "20px",
            }}
          >
            {Object.entries(bwResults).map(([unit, val]) => (
              <div
                key={unit}
                style={{
                  padding: "12px 14px",
                  backgroundColor: unit === bwUnit ? "var(--color-primary-50)" : "var(--color-surface-soft)",
                  border: `1px solid ${unit === bwUnit ? "var(--color-primary-500)" : "var(--color-border)"}`,
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>
                  {unit}
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: unit === bwUnit ? "var(--color-primary-600)" : "var(--color-text-primary)" }}>
                  {val.toLocaleString("id-ID", { maximumFractionDigits: 4 })}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleCopyResult(`${bwValue} ${bwUnit} = ${bwResults["MB/s"]} MB/s / ${bwResults["Mbps"]} Mbps`)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              minHeight: "44px",
              padding: "10px 20px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text-primary)",
              fontWeight: 600,
              fontSize: "0.92rem",
              cursor: "pointer",
            }}
          >
            {copied ? <CheckCircle2 size={16} color="var(--color-success)" /> : <Copy size={16} />}
            {copied ? "Disalin!" : "Salin Rincian"}
          </button>
        </div>
      )}

      {/* TAB 3: Number Bases (Dec <-> Bin <-> Hex) */}
      {activeTab === "bases" && (
        <div className="baseCard" style={{ padding: "clamp(20px, 4vw, 32px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Binary size={20} color="var(--color-primary-600)" />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Konversi Bilangan Desimal ↔ Biner ↔ Heksadesimal</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label htmlFor="decIn" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Nilai Desimal (Base 10) *
              </label>
              <input
                id="decIn"
                type="number"
                min="0"
                value={decInput}
                onChange={(e) => handleDecChange(e.target.value)}
                className="inputField"
                style={{ fontFamily: "var(--font-mono)" }}
                placeholder="Contoh: 192"
              />
            </div>

            <div>
              <label htmlFor="binIn" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Nilai Biner (Base 2) *
              </label>
              <input
                id="binIn"
                type="text"
                value={binInput}
                onChange={(e) => handleBinChange(e.target.value)}
                className="inputField"
                style={{ fontFamily: "var(--font-mono)" }}
                placeholder="Contoh: 11000000"
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
              gap: "12px",
              fontFamily: "var(--font-mono)",
              marginBottom: "20px",
            }}
          >
            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Biner (8-bit Octet)</div>
              <div style={{ fontWeight: 700, color: "var(--color-primary-600)", fontSize: "1.1rem" }}>{baseResults.binary8}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Heksadesimal (Hex)</div>
              <div style={{ fontWeight: 700, color: "var(--color-success)", fontSize: "1.1rem" }}>{baseResults.hex}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Oktal (Base 8)</div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{baseResults.octal}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleCopyResult(`Desimal: ${decInput} = Biner: ${baseResults.binary8} = Hex: ${baseResults.hex}`)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              minHeight: "44px",
              padding: "10px 20px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text-primary)",
              fontWeight: 600,
              fontSize: "0.92rem",
              cursor: "pointer",
            }}
          >
            {copied ? <CheckCircle2 size={16} color="var(--color-success)" /> : <Copy size={16} />}
            {copied ? "Disalin!" : "Salin Hasil"}
          </button>
        </div>
      )}

      {/* TAB 4: IPv4 <-> 32-bit Binary */}
      {activeTab === "ipBinary" && (
        <div className="baseCard" style={{ padding: "clamp(20px, 4vw, 32px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <ArrowRightLeft size={20} color="var(--color-primary-600)" />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Konverter Alamat IPv4 ↔ 32-bit Biner</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label htmlFor="ipDotted" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Format Dotted Decimal IPv4 *
              </label>
              <input
                id="ipDotted"
                type="text"
                value={ipv4Input}
                onChange={(e) => handleIpv4Change(e.target.value)}
                className="inputField"
                style={{ fontFamily: "var(--font-mono)" }}
                placeholder="Contoh: 192.168.1.1"
              />
            </div>

            <div>
              <label htmlFor="ipBin" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Format 32-Bit Biner (4 Oktet) *
              </label>
              <input
                id="ipBin"
                type="text"
                value={ipBinaryInput}
                onChange={(e) => handleIpBinaryChange(e.target.value)}
                className="inputField"
                style={{ fontFamily: "var(--font-mono)" }}
                placeholder="11000000.10101000.00000001.00000001"
              />
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--color-surface-soft)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              fontFamily: "var(--font-mono)",
              marginBottom: "20px",
            }}
          >
            <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Hasil Konversi Oktet:</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-primary-600)", overflowWrap: "anywhere" }}>
              {ipv4Input} ↔ {ipBinaryInput}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleCopyResult(`${ipv4Input} = ${ipBinaryInput}`)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              minHeight: "44px",
              padding: "10px 20px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text-primary)",
              fontWeight: 600,
              fontSize: "0.92rem",
              cursor: "pointer",
            }}
          >
            {copied ? <CheckCircle2 size={16} color="var(--color-success)" /> : <Copy size={16} />}
            {copied ? "Disalin!" : "Salin Biner"}
          </button>
        </div>
      )}

      {/* TAB 5: Subnet Mask <-> CIDR */}
      {activeTab === "maskCidr" && (
        <div className="baseCard" style={{ padding: "clamp(20px, 4vw, 32px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Sparkles size={20} color="var(--color-primary-600)" />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Subnet Mask ↔ CIDR Prefix Cheat Sheet</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div>
              <label htmlFor="maskIn" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Subnet Mask *
              </label>
              <input
                id="maskIn"
                type="text"
                value={maskInput}
                onChange={(e) => handleMaskChange(e.target.value)}
                className="inputField"
                style={{ fontFamily: "var(--font-mono)" }}
                placeholder="255.255.255.0"
              />
            </div>

            <div>
              <label htmlFor="cidrIn" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                CIDR Prefix (/{cidrInput}) *
              </label>
              <select
                id="cidrIn"
                className="inputField"
                value={cidrInput}
                onChange={(e) => handleCidrChange(Number(e.target.value))}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {Array.from({ length: 33 }, (_, i) => 32 - i).map((p) => (
                  <option key={p} value={p}>
                    /{p} ({prefixToMask(p)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Cheatsheet Table */}
          <div style={{ overflowX: "auto", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", marginBottom: "20px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", fontFamily: "var(--font-mono)", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-surface-soft)", borderBottom: "1px solid var(--color-border)" }}>
                  <th style={{ padding: "10px 14px" }}>CIDR</th>
                  <th style={{ padding: "10px 14px" }}>Subnet Mask</th>
                  <th style={{ padding: "10px 14px" }}>Total Alamat</th>
                  <th style={{ padding: "10px 14px" }}>Usable Host</th>
                </tr>
              </thead>
              <tbody>
                {[32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 20, 16, 8].map((p) => (
                  <tr
                    key={p}
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      backgroundColor: p === cidrInput ? "var(--color-primary-50)" : "transparent",
                    }}
                  >
                    <td style={{ padding: "8px 14px", fontWeight: 700, color: "var(--color-primary-600)" }}>/{p}</td>
                    <td style={{ padding: "8px 14px" }}>{prefixToMask(p)}</td>
                    <td style={{ padding: "8px 14px" }}>{Math.pow(2, 32 - p).toLocaleString("id-ID")}</td>
                    <td style={{ padding: "8px 14px", color: "var(--color-success)", fontWeight: 600 }}>
                      {p === 32 ? 1 : p === 31 ? 2 : Math.max(0, Math.pow(2, 32 - p) - 2).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={() => handleCopyResult(`CIDR /${cidrInput} = Subnet Mask ${maskInput}`)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              minHeight: "44px",
              padding: "10px 20px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text-primary)",
              fontWeight: 600,
              fontSize: "0.92rem",
              cursor: "pointer",
            }}
          >
            {copied ? <CheckCircle2 size={16} color="var(--color-success)" /> : <Copy size={16} />}
            {copied ? "Disalin!" : "Salin CIDR"}
          </button>
        </div>
      )}
    </div>
  );
}
