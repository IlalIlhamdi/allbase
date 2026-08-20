"use client";

import { useState } from "react";
import Link from "next/link";
import { analyzeIP, prefixToMask, IPAnalysisResult } from "@/lib/network";
import { Cpu, RotateCcw, Copy, CheckCircle, ChevronLeft, ArrowRight, Network, Binary, ShieldCheck } from "lucide-react";

export default function IpCalculator() {
  const [ip, setIp] = useState("192.168.1.1");
  const [prefix, setPrefix] = useState<number>(24);
  const [result, setResult] = useState<IPAnalysisResult | null>(() => analyzeIP("192.168.1.1", 24));
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

    const res = analyzeIP(trimmed, prefix);
    if (!res) {
      setError("Format alamat IPv4 tidak valid. Masukkan 4 oktet angka 0-255 (Contoh: 192.168.1.1).");
      setResult(null);
      return;
    }

    setResult(res);
  };

  const handleReset = () => {
    setIp("192.168.1.1");
    setPrefix(24);
    setError("");
    setResult(analyzeIP("192.168.1.1", 24));
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `ALLBASE IP & Subnet Analysis (${result.ip}/${result.prefix}):
- Subnet Mask: ${result.mask}
- Network Address: ${result.network}
- Broadcast Address: ${result.broadcast}
- Wildcard Mask: ${result.wildcard}
- Usable Host Range: ${result.firstHost} - ${result.lastHost}
- Total Usable Host: ${result.usableHosts.toLocaleString("id-ID")}
- Kelas IP: ${result.ipClass}
- Tipe / Scope: ${result.ipScope}
- Biner IP: ${result.binaryIp}
- Biner Mask: ${result.binaryMask}
- Heksadesimal: ${result.hexIp}
- Integer 32-bit: ${result.integerIp}`;

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

      {/* Main Analyzer Card */}
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
            <Cpu size={14} /> IP &amp; Subnet Analyzer
          </span>
          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
            IPv4 32-bit Architecture
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 1.8rem)", marginBottom: "6px" }}>IP &amp; Mask Calculator</h1>
        <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
          Analisis alokasi blok IPv4, representasi biner tiap oktet, heksadesimal, kelas IP, serta subnetting secara sinkron dan presisi.
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
              <label htmlFor="ipCalcInput" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                Alamat IPv4 *
              </label>
              <input
                id="ipCalcInput"
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="Contoh: 192.168.1.1"
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
              <label htmlFor="ipPrefixSelect" style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "6px" }}>
                CIDR Prefix / Mask *
              </label>
              <select
                id="ipPrefixSelect"
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
                    /{p} ({prefixToMask(p)})
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
              <Cpu size={16} /> Analisis Alamat IP
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

      {/* Result Section */}
      {result && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Main Info Grid */}
          <div
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "clamp(18px, 4vw, 28px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Ringkasan Blok IP &amp; Subnet</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
                  <ShieldCheck size={13} style={{ display: "inline", marginRight: "4px" }} />
                  {result.ipScope}
                </span>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "var(--radius-pill)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    backgroundColor: "var(--color-surface-soft)",
                    color: "var(--color-text-primary)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {result.ipClass}
                </span>
              </div>
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
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Alamat IP Host</div>
                <div style={{ fontWeight: 700, color: "var(--color-primary-600)" }}>{result.ip}</div>
              </div>

              <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Subnet Mask</div>
                <div style={{ fontWeight: 700 }}>{result.mask} (/{result.prefix})</div>
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
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Rentang Usable Host</div>
                <div style={{ fontWeight: 700, color: "var(--color-success)" }}>
                  {result.firstHost} &ndash; {result.lastHost}
                </div>
              </div>

              <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Total Host Dapat Dipakai</div>
                <div style={{ fontWeight: 700, color: "var(--color-success)" }}>
                  {result.usableHosts.toLocaleString("id-ID")} Host
                </div>
              </div>

              <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Total Alamat IP Blok</div>
                <div style={{ fontWeight: 700 }}>
                  {result.totalAddresses.toLocaleString("id-ID")} Alamat
                </div>
              </div>
            </div>
          </div>

          {/* Deep Binary Breakdown Box */}
          <div
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "clamp(18px, 4vw, 28px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Binary size={20} color="var(--color-primary-600)" />
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Representasi Biner 32-bit &amp; Heksadesimal</h2>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.88rem",
              }}
            >
              <div style={{ padding: "12px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "2px" }}>Biner IP ({result.ip})</div>
                <div style={{ fontWeight: 700, color: "var(--color-primary-600)" }}>{result.binaryIp}</div>
              </div>

              <div style={{ padding: "12px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "2px" }}>Biner Subnet Mask ({result.mask})</div>
                <div style={{ fontWeight: 700 }}>{result.binaryMask}</div>
              </div>

              <div style={{ padding: "12px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "2px" }}>Biner Network ({result.network})</div>
                <div style={{ fontWeight: 700 }}>{result.binaryNetwork}</div>
              </div>

              <div style={{ padding: "12px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "2px" }}>Biner Broadcast ({result.broadcast})</div>
                <div style={{ fontWeight: 700 }}>{result.binaryBroadcast}</div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
                  gap: "12px",
                  marginTop: "4px",
                }}
              >
                <div style={{ padding: "12px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "2px" }}>Heksadesimal (Hex Octets)</div>
                  <div style={{ fontWeight: 700, color: "var(--color-success)" }}>{result.hexIp}</div>
                </div>

                <div style={{ padding: "12px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", overflowWrap: "anywhere" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "2px" }}>Integer Desimal 32-bit</div>
                  <div style={{ fontWeight: 700 }}>{result.integerIp}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
