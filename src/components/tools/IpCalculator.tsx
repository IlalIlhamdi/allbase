"use client";

import { useState, useId } from "react";
import Link from "next/link";
import {
  Cpu,
  RotateCcw,
  Copy,
  CheckCircle2,
  Share2,
  ChevronLeft,
  Binary,
  Layers,
  Sparkles,
} from "lucide-react";
import { calculateSubnet, prefixToMask, isValidIPv4, SubnetResult } from "@/lib/network";
import { useToast } from "@/components/providers/ToastProvider";
import { useRecentTools } from "@/hooks/useRecentTools";
import styles from "@/components/tools/InternetSpeedTest.module.css";

const IP_PRESETS = [
  { label: "Privat Kelas C (192.168.1.1/24)", ip: "192.168.1.1", prefix: 24 },
  { label: "Privat Kelas A (10.0.0.1/8)", ip: "10.0.0.1", prefix: 8 },
  { label: "Privat Kelas B (172.16.0.1/16)", ip: "172.16.0.1", prefix: 16 },
  { label: "Google DNS (8.8.8.8/32)", ip: "8.8.8.8", prefix: 32 },
  { label: "Cloudflare (1.1.1.1/24)", ip: "1.1.1.1", prefix: 24 },
  { label: "P2P Link /31 (10.0.0.0/31)", ip: "10.0.0.0", prefix: 31 },
];

export default function IpCalculator() {
  const [ip, setIp] = useState("192.168.1.1");
  const [prefix, setPrefix] = useState<number>(24);
  const [result, setResult] = useState<SubnetResult | null>(() => calculateSubnet("192.168.1.1", 24));
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const ipInputId = useId();
  const prefixSelectId = useId();

  const { success, error: toastError } = useToast();
  const { addRecentTool } = useRecentTools();

  // Track as recent tool
  useState(() => {
    addRecentTool("ip-calculator-tool");
  });

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    const res = calculateSubnet(ip.trim(), prefix);
    if (!res) {
      setError("Format alamat IPv4 tidak valid. Masukkan 4 oktet desimal (0-255), contoh: 192.168.1.1");
      setResult(null);
      return;
    }

    setResult(res);
  };

  const handleApplyPreset = (presetIp: string, presetPrefix: number) => {
    setIp(presetIp);
    setPrefix(presetPrefix);
    setError("");
    const res = calculateSubnet(presetIp, presetPrefix);
    setResult(res);
  };

  const handleReset = () => {
    setIp("192.168.1.1");
    setPrefix(24);
    setError("");
    setResult(calculateSubnet("192.168.1.1", 24));
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `ALLBASE IP & Mask Calculator Result:
- IP Address: ${result.ip}/${result.prefix}
- IP Class / Type: ${result.ipClass} (${result.ipType})
- Subnet Mask: ${result.mask}
- Wildcard Mask: ${result.wildcard}
- Network Address: ${result.network}
- Broadcast Address: ${result.broadcast}
- Usable Host Range: ${result.firstHost} - ${result.lastHost}
- Total Hosts: ${result.totalAddresses.toLocaleString("id-ID")}
- Usable Hosts: ${result.usableHosts.toLocaleString("id-ID")}
- IP Binary: ${result.ipBinary}
- Mask Binary: ${result.maskBinary}
Dihitung via allbase.my.id/tools/ip-calculator`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    success("Hasil kalkulasi IP berhasil disalin!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share && result) {
      try {
        await navigator.share({
          title: `Hasil Kalkulasi IP: ${result.ip}/${result.prefix}`,
          text: `Analisis Alokasi IP ${result.ip}/${result.prefix} - Network: ${result.network}, Usable: ${result.usableHosts} Hosts`,
          url: window.location.href,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

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
        <div style={{ display: "flex", gap: "8px" }}>
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
      </div>

      {/* Main Input Form Card */}
      <div className="baseCard" style={{ padding: "clamp(20px, 4vw, 32px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
          <span className="sectionBadge" style={{ margin: 0 }}>
            <Cpu size={14} /> IP &amp; Mask Analysis
          </span>
          <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
            IPv4 Architecture
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 1.85rem)", fontWeight: 800, marginBottom: "8px" }}>
          IP &amp; Mask Calculator
        </h1>
        <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
          Analisis alokasi blok alamat IPv4, identifikasi kelas &amp; tipe alamat jaringan, wildcard mask, dan representasi 32-bit biner secara instan.
        </p>

        {/* Quick Example Presets */}
        <div style={{ marginBottom: "20px" }}>
          <span style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-muted)", marginBottom: "8px" }}>
            <Sparkles size={13} style={{ display: "inline", marginRight: "4px" }} /> Contoh Preset Cepat:
          </span>
          <div className="filterScroll">
            {IP_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleApplyPreset(p.ip, p.prefix)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-pill)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  backgroundColor: "var(--color-surface-soft)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleCalculate}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label
                htmlFor={ipInputId}
                style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}
              >
                Alamat IPv4 *
              </label>
              <input
                id={ipInputId}
                type="text"
                className="inputField"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="Contoh: 192.168.1.1"
                style={{ fontFamily: "var(--font-mono)" }}
                required
              />
            </div>

            <div>
              <label
                htmlFor={prefixSelectId}
                style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}
              >
                Prefix CIDR / Subnet Mask *
              </label>
              <select
                id={prefixSelectId}
                className="inputField"
                value={prefix}
                onChange={(e) => {
                  const p = Number(e.target.value);
                  setPrefix(p);
                  if (isValidIPv4(ip.trim())) {
                    setResult(calculateSubnet(ip.trim(), p));
                  }
                }}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {Array.from({ length: 33 }, (_, i) => 32 - i).map((p) => (
                  <option key={p} value={p}>
                    /{p} — {prefixToMask(p)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div style={{ color: "var(--color-danger)", fontSize: "0.88rem", marginBottom: "16px", fontWeight: 600 }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="submit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                minHeight: "44px",
                padding: "10px 20px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--color-primary-600)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "0.92rem",
                flex: "1 1 140px",
                cursor: "pointer",
              }}
            >
              <Cpu size={16} /> Hitung Rincian IP
            </button>

            <button
              type="button"
              onClick={handleReset}
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
                flex: "1 1 110px",
                cursor: "pointer",
              }}
            >
              <RotateCcw size={16} /> Reset
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!result}
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
                color: result ? "var(--color-text-primary)" : "var(--color-text-muted)",
                fontWeight: 600,
                fontSize: "0.92rem",
                cursor: result ? "pointer" : "not-allowed",
                flex: "1 1 140px",
              }}
            >
              {copied ? <CheckCircle2 size={16} color="var(--color-success)" /> : <Copy size={16} />}
              {copied ? "Disalin!" : "Salin Hasil"}
            </button>
          </div>
        </form>
      </div>

      {/* Results View Card */}
      {result && (
        <div className="baseCard" style={{ padding: "clamp(20px, 4vw, 28px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
              Hasil Analisis Alokasi IP Address
            </h2>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "var(--radius-pill)",
                fontSize: "0.75rem",
                fontWeight: 700,
                backgroundColor: "var(--color-primary-50)",
                color: "var(--color-primary-600)",
                border: "1px solid var(--color-border)",
              }}
            >
              {result.ipType}
            </span>
          </div>

          {result.specialNote && (
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "var(--color-warning-soft)",
                borderRadius: "var(--radius-sm)",
                color: "var(--color-text-primary)",
                fontSize: "0.85rem",
                fontWeight: 500,
                marginBottom: "16px",
                borderLeft: "4px solid var(--color-warning)",
              }}
            >
              {result.specialNote}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
              gap: "12px",
              fontFamily: "var(--font-mono)",
              marginBottom: "20px",
            }}
          >
            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>IP Address &amp; Kelas</div>
              <div style={{ fontWeight: 700 }}>
                {result.ip} <span style={{ fontSize: "0.78rem", color: "var(--color-primary-600)" }}>({result.ipClass})</span>
              </div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Subnet Mask (CIDR)</div>
              <div style={{ fontWeight: 700 }}>
                {result.mask} <span style={{ color: "var(--color-primary-600)" }}>(/{result.prefix})</span>
              </div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Network Address</div>
              <div style={{ fontWeight: 700, color: "var(--color-primary-600)" }}>{result.network}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Broadcast Address</div>
              <div style={{ fontWeight: 700 }}>{result.broadcast}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Wildcard Mask</div>
              <div style={{ fontWeight: 700 }}>{result.wildcard}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>First Usable Host</div>
              <div style={{ fontWeight: 700, color: "var(--color-success)" }}>{result.firstHost}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Last Usable Host</div>
              <div style={{ fontWeight: 700, color: "var(--color-success)" }}>{result.lastHost}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Total Usable Hosts</div>
              <div style={{ fontWeight: 700, color: "var(--color-success)" }}>
                {result.usableHosts.toLocaleString("id-ID")} Host
              </div>
            </div>
          </div>

          {/* 32-bit Binary Breakdown Card */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--color-surface-soft)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 700, marginBottom: "12px", color: "var(--color-text-muted)" }}>
              <Binary size={15} /> Representasi Biner 32-Bit
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>IP Address:</span>
                <span style={{ fontWeight: 700, color: "var(--color-primary-600)" }}>{result.ipBinary}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Subnet Mask:</span>
                <span style={{ fontWeight: 700 }}>{result.maskBinary}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Wildcard:</span>
                <span style={{ fontWeight: 700 }}>{result.wildcardBinary}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Network ID:</span>
                <span style={{ fontWeight: 700, color: "var(--color-success)" }}>{result.networkBinary}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
