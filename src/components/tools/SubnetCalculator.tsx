"use client";

import { useState, useId } from "react";
import Link from "next/link";
import {
  Calculator,
  RotateCcw,
  Copy,
  CheckCircle2,
  Share2,
  ChevronLeft,
  Network,
  Sparkles,
  Layers,
} from "lucide-react";
import { calculateSubnet, prefixToMask, isValidIPv4, SubnetResult } from "@/lib/network";
import { useToast } from "@/components/providers/ToastProvider";
import { useRecentTools } from "@/hooks/useRecentTools";

const SUBNET_PRESETS = [
  { label: "Kelas C Standard (/24)", ip: "192.168.1.0", prefix: 24 },
  { label: "Subnetting /28 (16 IP, 14 Host)", ip: "192.168.1.0", prefix: 28 },
  { label: "Subnetting /26 (64 IP, 62 Host)", ip: "192.168.1.0", prefix: 26 },
  { label: "Subnetting /30 (Link Router 2 Host)", ip: "10.0.0.0", prefix: 30 },
  { label: "RFC 3021 /31 (Point-to-Point)", ip: "10.0.0.0", prefix: 31 },
  { label: "Kelas B Standard (/16)", ip: "172.16.0.0", prefix: 16 },
];

export default function SubnetCalculator() {
  const [ip, setIp] = useState("192.168.1.1");
  const [prefix, setPrefix] = useState<number>(24);
  const [result, setResult] = useState<SubnetResult | null>(() => calculateSubnet("192.168.1.1", 24));
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const ipInputId = useId();
  const prefixSelectId = useId();

  const { success } = useToast();
  const { addRecentTool } = useRecentTools();

  useState(() => {
    addRecentTool("subnet-calculator-tool");
  });

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    const res = calculateSubnet(ip.trim(), prefix);
    if (!res) {
      setError("Format alamat IPv4 tidak valid. Masukkan format 4 oktet desimal (contoh: 192.168.1.1).");
      setResult(null);
      return;
    }

    setResult(res);
  };

  const handleApplyPreset = (presetIp: string, presetPrefix: number) => {
    setIp(presetIp);
    setPrefix(presetPrefix);
    setError("");
    setResult(calculateSubnet(presetIp, presetPrefix));
  };

  const handleReset = () => {
    setIp("192.168.1.1");
    setPrefix(24);
    setError("");
    setResult(calculateSubnet("192.168.1.1", 24));
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `ALLBASE Subnet Calculator Result (${result.ip}/${result.prefix}):
- Subnet Mask: ${result.mask}
- Network Address: ${result.network}
- Broadcast Address: ${result.broadcast}
- Wildcard Mask: ${result.wildcard}
- First Usable Host: ${result.firstHost}
- Last Usable Host: ${result.lastHost}
- Total Addresses: ${result.totalAddresses.toLocaleString("id-ID")}
- Total Usable Hosts: ${result.usableHosts.toLocaleString("id-ID")}
- IP Class / Type: ${result.ipClass} (${result.ipType})
- Borrowed Bits / Subnets: ${result.borrowedBits} bit (${result.subnetsCount} Subnet)
Dihitung via allbase.my.id/tools/subnet-calculator`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    success("Hasil kalkulasi subnet berhasil disalin!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share && result) {
      try {
        await navigator.share({
          title: `Hasil Subnetting: ${result.ip}/${result.prefix}`,
          text: `Subnetting IPv4 ${result.ip}/${result.prefix} - Network: ${result.network}, Broadcast: ${result.broadcast}, Usable: ${result.usableHosts} Hosts`,
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

      {/* Form Card */}
      <div className="baseCard" style={{ padding: "clamp(20px, 4vw, 32px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
          <span className="sectionBadge" style={{ margin: 0 }}>
            <Network size={14} /> IP Subnetting &amp; CIDR
          </span>
          <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
            RFC 4632 / RFC 3021
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 1.85rem)", fontWeight: 800, marginBottom: "8px" }}>
          Subnet Calculator IPv4
        </h1>
        <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
          Kalkulator presisi untuk menghitung pembagian blok subnet IPv4, Network Address, Broadcast Address, Wildcard Mask, dan usable host range.
        </p>

        {/* Quick Example Presets */}
        <div style={{ marginBottom: "20px" }}>
          <span style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-muted)", marginBottom: "8px" }}>
            <Sparkles size={13} style={{ display: "inline", marginRight: "4px" }} /> Contoh Skenario Subnet:
          </span>
          <div className="filterScroll">
            {SUBNET_PRESETS.map((p) => (
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
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label htmlFor={ipInputId} style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Alamat IPv4 *
              </label>
              <input
                id={ipInputId}
                type="text"
                className="inputField"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="192.168.1.1"
                style={{ fontFamily: "var(--font-mono)" }}
                required
              />
            </div>

            <div>
              <label htmlFor={prefixSelectId} style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                CIDR Prefix / Subnet Mask *
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
                    /{p} ({prefixToMask(p)})
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
              <Calculator size={16} /> Hitung Subnet
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

      {/* Result Grid */}
      {result && (
        <div className="baseCard" style={{ padding: "clamp(20px, 4vw, 28px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
              Hasil Kalkulasi Subnetting
            </h2>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
                {result.ipClass}
              </span>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-pill)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  backgroundColor: "var(--color-surface-soft)",
                  color: "var(--color-text-primary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {result.ipType}
              </span>
            </div>
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
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
              gap: "12px",
              fontFamily: "var(--font-mono)",
              marginBottom: "20px",
            }}
          >
            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>IP Address</div>
              <div style={{ fontWeight: 700 }}>
                {result.ip}
              </div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Subnet Mask</div>
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

          {/* Subnetting Borrowed Bits Card */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--color-surface-soft)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 700, marginBottom: "12px", color: "var(--color-text-muted)" }}>
              <Layers size={15} /> Rincian Alokasi Subnet
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "12px", fontSize: "0.88rem" }}>
              <div>
                <span style={{ color: "var(--color-text-muted)", display: "block", fontSize: "0.75rem" }}>Total Alamat IP (Blok):</span>
                <strong>{result.totalAddresses.toLocaleString("id-ID")} Alamat</strong>
              </div>
              <div>
                <span style={{ color: "var(--color-text-muted)", display: "block", fontSize: "0.75rem" }}>Bit Pinjaman Subnet:</span>
                <strong>{result.borrowedBits} Bit</strong>
              </div>
              <div>
                <span style={{ color: "var(--color-text-muted)", display: "block", fontSize: "0.75rem" }}>Jumlah Subnet Terbentuk:</span>
                <strong>{result.subnetsCount.toLocaleString("id-ID")} Subnet</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

