"use client";

import { useState } from "react";
import Link from "next/link";
import { calculateSubnet, prefixToMask, SubnetResult } from "@/lib/network";
import { Calculator, RotateCcw, Copy, CheckCircle, Network, ChevronLeft, ArrowRight, Binary } from "lucide-react";

export default function SubnetCalculator() {
  const [ip, setIp] = useState("192.168.1.10");
  const [prefix, setPrefix] = useState<number>(24);
  const [result, setResult] = useState<SubnetResult | null>(() => calculateSubnet("192.168.1.10", 24));
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    const trimmed = ip.trim();
    if (!trimmed) {
      setError("Silakan masukkan alamat IPv4.");
      setResult(null);
      return;
    }

    const res = calculateSubnet(trimmed, prefix);
    if (!res) {
      setError("Format alamat IPv4 tidak valid. Masukkan 4 oktet angka 0-255 (Contoh: 192.168.1.10).");
      setResult(null);
      return;
    }

    setResult(res);
  };

  const handleReset = () => {
    setIp("192.168.1.10");
    setPrefix(24);
    setError("");
    setResult(calculateSubnet("192.168.1.10", 24));
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
- Usable Host: ${result.usableHosts.toLocaleString("id-ID")}
- Total Address: ${result.totalAddresses.toLocaleString("id-ID")}
- Kelas IP: ${result.ipClass}
- Tipe / Scope: ${result.ipScope}
- Biner IP: ${result.binaryIp}
- Hex IP: ${result.hexIp}`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "900px", marginInline: "auto" }}>
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
            href="/tools/ip-calculator"
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
            <span>IP Analyzer</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Form Card */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "clamp(18px, 4vw, 32px)",
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
            <Network size={14} /> Subnetting IPv4
          </span>
          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
            Standard RFC 791 / RFC 3021
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 1.8rem)", marginBottom: "6px" }}>Subnet Calculator IPv4</h1>
        <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
          Hitung Network Address, Broadcast Address, Wildcard Mask, rentang Usable Host, dan rincian alokasi CIDR IPv4 secara akurat.
        </p>

        <form onSubmit={handleCalculate}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div>
              <label htmlFor="ipInput" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Alamat IPv4 *
              </label>
              <input
                id="ipInput"
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="Contoh: 192.168.1.10"
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
                required
              />
            </div>

            <div>
              <label htmlFor="prefixSelect" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                CIDR Prefix / Subnet Mask *
              </label>
              <select
                id="prefixSelect"
                value={prefix}
                onChange={(e) => setPrefix(Number(e.target.value))}
                style={{
                  width: "100%",
                  minHeight: "44px",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "1rem",
                  color: "var(--color-text-primary)",
                }}
              >
                {Array.from({ length: 33 }, (_, i) => 32 - i).map((p) => (
                  <option key={p} value={p} style={{ backgroundColor: "var(--color-surface)", color: "var(--color-text-primary)" }}>
                    /{p} — {prefixToMask(p)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div style={{ color: "var(--color-danger)", backgroundColor: "var(--color-danger-soft)", padding: "10px 14px", borderRadius: "var(--radius-sm)", fontSize: "0.88rem", marginBottom: "16px", fontWeight: 600 }}>
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
                flex: "1 1 120px",
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
              {copied ? <CheckCircle size={16} color="var(--color-success)" /> : <Copy size={16} />}
              {copied ? "Disalin!" : "Salin Hasil"}
            </button>
          </div>
        </form>
      </div>

      {/* Result Grid */}
      {result && (
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "clamp(18px, 4vw, 28px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Hasil Kalkulasi Subnetting ({result.ip}/{result.prefix})</h2>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "var(--radius-pill)",
                fontSize: "0.75rem",
                fontWeight: 600,
                backgroundColor: "var(--color-primary-50)",
                color: "var(--color-primary-600)",
                border: "1px solid var(--color-border)",
              }}
            >
              {result.ipScope}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
              gap: "12px",
              fontFamily: "var(--font-mono)",
            }}
          >
            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>IP Address / Kelas</div>
              <div style={{ fontWeight: 700 }}>
                {result.ip} <span style={{ fontSize: "0.78rem", color: "var(--color-primary-600)" }}>({result.ipClass})</span>
              </div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Subnet Mask</div>
              <div style={{ fontWeight: 700 }}>
                {result.mask} (/{result.prefix})
              </div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Network Address</div>
              <div style={{ fontWeight: 700, color: "var(--color-primary-600)" }}>{result.network}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Broadcast Address</div>
              <div style={{ fontWeight: 700 }}>{result.broadcast}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Wildcard Mask</div>
              <div style={{ fontWeight: 700 }}>{result.wildcard}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>First Usable Host</div>
              <div style={{ fontWeight: 700, color: "var(--color-success)" }}>{result.firstHost}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Last Usable Host</div>
              <div style={{ fontWeight: 700, color: "var(--color-success)" }}>{result.lastHost}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Usable Host / Total</div>
              <div style={{ fontWeight: 700, color: "var(--color-success)" }}>
                {result.usableHosts.toLocaleString("id-ID")} / {result.totalAddresses.toLocaleString("id-ID")}
              </div>
            </div>
          </div>

          {/* Binary Representation Box */}
          <div
            style={{
              marginTop: "16px",
              padding: "16px",
              backgroundColor: "var(--color-surface-soft)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              overflowWrap: "anywhere",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "4px" }}>
              <Binary size={15} color="var(--color-primary-600)" /> Format Biner &amp; Heksadesimal
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
              <span style={{ color: "var(--color-text-muted)" }}>Biner IP ({result.ip}):</span>
              <span style={{ fontWeight: 700, color: "var(--color-primary-600)" }}>{result.binaryIp}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
              <span style={{ color: "var(--color-text-muted)" }}>Heksadesimal:</span>
              <span style={{ fontWeight: 700 }}>{result.hexIp}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
              <span style={{ color: "var(--color-text-muted)" }}>Integer 32-bit:</span>
              <span style={{ fontWeight: 700 }}>{result.integerIp}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
