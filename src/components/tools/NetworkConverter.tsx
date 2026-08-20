"use client";

import { useState } from "react";
import Link from "next/link";
import {
  convertMbpsToMBps,
  convertMBpsToMbps,
  prefixToMask,
  maskToPrefix,
  convertDecimalToBinary,
  convertBinaryToDecimal,
  convertDecimalToHex,
  convertHexToDecimal,
} from "@/lib/network";
import { Binary, Zap, Repeat, RotateCcw, Copy, CheckCircle, ChevronLeft, ArrowRight, Network } from "lucide-react";

export default function NetworkConverter() {
  const [activeTab, setActiveTab] = useState<"speed" | "bases" | "subnet">("speed");

  // Tab 1: Speed Converter State
  const [mbps, setMbps] = useState<string>("100");
  const [mBps, setMBps] = useState<string>("12.5");

  // Tab 2: Number Bases Converter State
  const [decInput, setDecInput] = useState<string>("192");
  const [binInput, setBinInput] = useState<string>("11000000");
  const [hexInput, setHexInput] = useState<string>("C0");
  const [baseError, setBaseError] = useState<string>("");

  // Tab 3: Subnet Mask & CIDR Converter State
  const [cidrPrefix, setCidrPrefix] = useState<number>(24);
  const [maskInput, setMaskInput] = useState<string>("255.255.255.0");
  const [maskConvertedCidr, setMaskConvertedCidr] = useState<string>("/24");
  const [maskError, setMaskError] = useState<string>("");

  const [copied, setCopied] = useState(false);

  // Speed Handlers
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

  // Base Handlers
  const handleDecChange = (val: string) => {
    setDecInput(val);
    setBaseError("");
    if (!val.trim()) {
      setBinInput("");
      setHexInput("");
      return;
    }
    const binRes = convertDecimalToBinary(val);
    const hexRes = convertDecimalToHex(val);
    if (binRes.error) {
      setBaseError(binRes.error);
      setBinInput("");
      setHexInput("");
      return;
    }
    setBinInput(binRes.value);
    setHexInput(hexRes.value);
  };

  const handleBinChange = (val: string) => {
    setBinInput(val);
    setBaseError("");
    if (!val.trim()) {
      setDecInput("");
      setHexInput("");
      return;
    }
    const decRes = convertBinaryToDecimal(val);
    if (decRes.error) {
      setBaseError(decRes.error);
      setDecInput("");
      setHexInput("");
      return;
    }
    setDecInput(decRes.value);
    const hexRes = convertDecimalToHex(decRes.value);
    setHexInput(hexRes.value);
  };

  const handleHexChange = (val: string) => {
    setHexInput(val);
    setBaseError("");
    if (!val.trim()) {
      setDecInput("");
      setBinInput("");
      return;
    }
    const decRes = convertHexToDecimal(val);
    if (decRes.error) {
      setBaseError(decRes.error);
      setDecInput("");
      setBinInput("");
      return;
    }
    setDecInput(decRes.value);
    const binRes = convertDecimalToBinary(decRes.value);
    setBinInput(binRes.value);
  };

  const resetBasesForm = () => {
    setDecInput("192");
    setBinInput("11000000");
    setHexInput("C0");
    setBaseError("");
  };

  // Subnet / CIDR Handlers
  const handleCidrChange = (val: number) => {
    setCidrPrefix(val);
  };

  const handleMaskChange = (val: string) => {
    setMaskInput(val);
    setMaskError("");
    const trimmed = val.trim();
    if (!trimmed) {
      setMaskConvertedCidr("");
      return;
    }
    const prefixResult = maskToPrefix(trimmed);
    if (prefixResult === null) {
      setMaskError("Subnet mask tidak valid (harus berupa bit 1 berurutan seperti 255.255.255.0).");
      setMaskConvertedCidr("—");
      return;
    }
    setMaskConvertedCidr(`/${prefixResult}`);
  };

  const resetSubnetForm = () => {
    setCidrPrefix(24);
    setMaskInput("255.255.255.0");
    setMaskConvertedCidr("/24");
    setMaskError("");
  };

  // Copy Handlers
  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "850px", marginInline: "auto" }}>
      {/* Top Breadcrumb Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          padding: "12px 18px",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <Link
          href="/#tools"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            minHeight: "44px",
            fontSize: "0.88rem",
            fontWeight: 600,
            color: "var(--color-primary-600)",
          }}
          aria-label="Kembali ke Tools ALLBASE"
        >
          <ChevronLeft size={18} />
          <span>Kembali ke Tools</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link
            href="/tools/subnet-calculator"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              minHeight: "44px",
              padding: "6px 12px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-surface-soft)",
              border: "1px solid var(--color-border)",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--color-text-primary)",
            }}
          >
            <span>Subnet Calculator</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Header & Mode Switcher */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "clamp(18px, 4vw, 28px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
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
            <Binary size={14} /> Network Converter Suite
          </span>
          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
            Real-time Converter
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 1.8rem)", marginBottom: "6px" }}>Konversi Satuan Jaringan</h1>
        <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
          Konversi kecepatan bandwidth (Mbps &harr; MB/s), bilangan desimal &harr; biner &harr; heksadesimal, serta Subnet Mask &harr; CIDR prefix.
        </p>

        {/* Converter Mode Tabs */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", borderBottom: "1px solid var(--color-border)", paddingBottom: "12px" }}>
          <button
            onClick={() => setActiveTab("speed")}
            aria-pressed={activeTab === "speed"}
            style={{
              padding: "8px 16px",
              minHeight: "44px",
              borderRadius: "var(--radius-sm)",
              fontWeight: 600,
              fontSize: "0.88rem",
              backgroundColor: activeTab === "speed" ? "var(--color-primary-600)" : "var(--color-surface-soft)",
              color: activeTab === "speed" ? "#ffffff" : "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              transition: "all var(--transition-fast)",
            }}
          >
            <Zap size={14} style={{ display: "inline", marginRight: "6px" }} /> Mbps &harr; MB/s
          </button>

          <button
            onClick={() => setActiveTab("bases")}
            aria-pressed={activeTab === "bases"}
            style={{
              padding: "8px 16px",
              minHeight: "44px",
              borderRadius: "var(--radius-sm)",
              fontWeight: 600,
              fontSize: "0.88rem",
              backgroundColor: activeTab === "bases" ? "var(--color-primary-600)" : "var(--color-surface-soft)",
              color: activeTab === "bases" ? "#ffffff" : "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              transition: "all var(--transition-fast)",
            }}
          >
            <Binary size={14} style={{ display: "inline", marginRight: "6px" }} /> Desimal &harr; Biner &harr; Hex
          </button>

          <button
            onClick={() => setActiveTab("subnet")}
            aria-pressed={activeTab === "subnet"}
            style={{
              padding: "8px 16px",
              minHeight: "44px",
              borderRadius: "var(--radius-sm)",
              fontWeight: 600,
              fontSize: "0.88rem",
              backgroundColor: activeTab === "subnet" ? "var(--color-primary-600)" : "var(--color-surface-soft)",
              color: activeTab === "subnet" ? "#ffffff" : "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              transition: "all var(--transition-fast)",
            }}
          >
            <Network size={14} style={{ display: "inline", marginRight: "6px" }} /> Subnet Mask &harr; CIDR
          </button>
        </div>
      </div>

      {/* Tab 1: Bandwidth Mbps <-> MB/s */}
      {activeTab === "speed" && (
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "clamp(18px, 4vw, 24px)",
          }}
        >
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
                Kecepatan ISP (Mbps &ndash; Megabit/s) *
              </label>
              <input
                id="mbpsInput"
                type="number"
                value={mbps}
                onChange={(e) => handleMbpsChange(e.target.value)}
                placeholder="100"
                min="0"
                step="any"
                style={{
                  width: "100%",
                  minHeight: "44px",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "1rem",
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
                Kecepatan Download (MB/s &ndash; Megabyte/s) *
              </label>
              <input
                id="mBpsInput"
                type="number"
                value={mBps}
                onChange={(e) => handleMBpsChange(e.target.value)}
                placeholder="12.5"
                min="0"
                step="any"
                style={{
                  width: "100%",
                  minHeight: "44px",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
            <button
              onClick={resetSpeedForm}
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
              }}
            >
              <RotateCcw size={16} /> Reset
            </button>

            <button
              onClick={() => handleCopy(`${mbps || 0} Mbps = ${mBps || 0} MB/s`)}
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
                flex: "1 1 140px",
              }}
            >
              {copied ? <CheckCircle size={16} color="var(--color-success)" /> : <Copy size={16} />}
              {copied ? "Hasil Disalin!" : "Salin Hasil"}
            </button>
          </div>

          <div
            style={{
              padding: "20px",
              backgroundColor: "var(--color-surface-soft)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              overflowWrap: "anywhere",
            }}
          >
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Hasil Konversi Kecepatan</div>
            <div style={{ fontSize: "clamp(1.2rem, 4vw, 1.4rem)", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--color-primary-600)" }}>
              {mbps || 0} Mbps = {mBps || 0} MB/s
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)", marginTop: "8px" }}>
              1 Byte = 8 bit. ISP biasanya mencantumkan kecepatan dalam Mbps (Megabit per detik), sedangkan download manager mengukur dalam MB/s (Megabyte per detik).
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Decimal <-> Binary <-> Hex Multi-way */}
      {activeTab === "bases" && (
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "clamp(18px, 4vw, 24px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label htmlFor="decInputVal" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Desimal (Basis 10)
              </label>
              <input
                id="decInputVal"
                type="text"
                value={decInput}
                onChange={(e) => handleDecChange(e.target.value)}
                placeholder="Contoh: 192"
                style={{
                  width: "100%",
                  minHeight: "44px",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div>
              <label htmlFor="binInputVal" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Biner (Basis 2)
              </label>
              <input
                id="binInputVal"
                type="text"
                value={binInput}
                onChange={(e) => handleBinChange(e.target.value)}
                placeholder="Contoh: 11000000"
                style={{
                  width: "100%",
                  minHeight: "44px",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div>
              <label htmlFor="hexInputVal" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Heksadesimal (Basis 16)
              </label>
              <input
                id="hexInputVal"
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="Contoh: C0"
                style={{
                  width: "100%",
                  minHeight: "44px",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>

          {baseError && (
            <div style={{ color: "var(--color-danger)", backgroundColor: "var(--color-danger-soft)", padding: "10px 14px", borderRadius: "var(--radius-sm)", fontSize: "0.88rem", marginBottom: "16px", fontWeight: 600 }}>
              {baseError}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            <button
              onClick={resetBasesForm}
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
              }}
            >
              <RotateCcw size={16} /> Reset
            </button>

            <button
              onClick={() => handleCopy(`Desimal: ${decInput || 0}\nBiner: ${binInput || 0}\nHex: ${hexInput || 0}`)}
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
                flex: "1 1 140px",
              }}
            >
              {copied ? <CheckCircle size={16} color="var(--color-success)" /> : <Copy size={16} />}
              {copied ? "Hasil Disalin!" : "Salin Hasil"}
            </button>
          </div>

          <div
            style={{
              padding: "18px",
              backgroundColor: "var(--color-surface-soft)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.92rem",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              overflowWrap: "anywhere",
            }}
          >
            <div style={{ color: "var(--color-text-muted)", fontSize: "0.78rem" }}>Nilai Sinkron:</div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
              <span>Desimal (10):</span>
              <strong style={{ color: "var(--color-primary-600)" }}>{decInput || "0"}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
              <span>Biner (2):</span>
              <strong style={{ color: "var(--color-success)" }}>{binInput || "0"}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
              <span>Heksadesimal (16):</span>
              <strong>{hexInput || "0"}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Subnet Mask <-> CIDR */}
      {activeTab === "subnet" && (
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "clamp(18px, 4vw, 24px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
              gap: "24px",
              marginBottom: "24px",
            }}
          >
            {/* CIDR -> Subnet Mask */}
            <div
              style={{
                padding: "16px",
                backgroundColor: "var(--color-surface-soft)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
              }}
            >
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "12px" }}>CIDR Prefix &rarr; Subnet Mask</h3>
              <label htmlFor="cidrSelect" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                Pilih Prefix CIDR
              </label>
              <select
                id="cidrSelect"
                value={cidrPrefix}
                onChange={(e) => handleCidrChange(Number(e.target.value))}
                style={{
                  width: "100%",
                  minHeight: "44px",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "1rem",
                  marginBottom: "12px",
                }}
              >
                {Array.from({ length: 33 }, (_, i) => 32 - i).map((p) => (
                  <option key={p} value={p}>
                    /{p}
                  </option>
                ))}
              </select>

              <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Subnet Mask Dihasilkan:</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--color-primary-600)" }}>
                {prefixToMask(cidrPrefix)}
              </div>
            </div>

            {/* Subnet Mask -> CIDR */}
            <div
              style={{
                padding: "16px",
                backgroundColor: "var(--color-surface-soft)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
              }}
            >
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "12px" }}>Subnet Mask &rarr; CIDR Prefix</h3>
              <label htmlFor="maskInputVal" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                Ketik Subnet Mask
              </label>
              <input
                id="maskInputVal"
                type="text"
                value={maskInput}
                onChange={(e) => handleMaskChange(e.target.value)}
                placeholder="Contoh: 255.255.255.0"
                style={{
                  width: "100%",
                  minHeight: "44px",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "1rem",
                  marginBottom: "12px",
                }}
              />

              {maskError ? (
                <div style={{ fontSize: "0.82rem", color: "var(--color-danger)", fontWeight: 600 }}>{maskError}</div>
              ) : (
                <>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Prefix CIDR Dihasilkan:</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--color-success)" }}>
                    {maskConvertedCidr}
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={resetSubnetForm}
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
              }}
            >
              <RotateCcw size={16} /> Reset
            </button>

            <button
              onClick={() => handleCopy(`CIDR /${cidrPrefix} = ${prefixToMask(cidrPrefix)}\nSubnet Mask ${maskInput} = ${maskConvertedCidr}`)}
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
                flex: "1 1 140px",
              }}
            >
              {copied ? <CheckCircle size={16} color="var(--color-success)" /> : <Copy size={16} />}
              {copied ? "Hasil Disalin!" : "Salin Hasil"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
