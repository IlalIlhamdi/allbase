"use client";

import { useState } from "react";
import { calculateSubnet, prefixToMask, SubnetResult } from "@/lib/network";
import { Calculator, RotateCcw, Copy, CheckCircle, Network } from "lucide-react";

export default function SubnetCalculator() {
  const [ip, setIp] = useState("192.168.1.1");
  const [prefix, setPrefix] = useState<number>(24);
  const [result, setResult] = useState<SubnetResult | null>(() => calculateSubnet("192.168.1.1", 24));
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    const res = calculateSubnet(ip, prefix);
    if (!res) {
      setError("Format alamat IPv4 tidak valid (Contoh: 192.168.1.1).");
      setResult(null);
      return;
    }

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
    const text = `Subnet Calculator Result (${result.ip}/${result.prefix}):
- Subnet Mask: ${result.mask}
- Network Address: ${result.network}
- Broadcast Address: ${result.broadcast}
- Wildcard Mask: ${result.wildcard}
- First Usable Host: ${result.firstHost}
- Last Usable Host: ${result.lastHost}
- Total Usable Host: ${result.usableHosts}
- Kelas IP: ${result.ipClass}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Form Card */}
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
            <Network size={14} /> IP Subnetting
          </span>
          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
            IPv4 Standard
          </span>
        </div>

        <h1 style={{ fontSize: "1.6rem", marginBottom: "6px" }}>Subnet Calculator IPv4</h1>
        <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", marginBottom: "24px" }}>
          Hitung pembagian blok subnet IPv4, Network Address, Broadcast Address, Wildcard Mask, dan usable host range.
        </p>

        <form onSubmit={handleCalculate}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
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
                placeholder="192.168.1.1"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontFamily: "var(--font-mono)",
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
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  fontFamily: "var(--font-mono)",
                }}
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
              <Calculator size={16} /> Hitung Subnet
            </button>

            <button
              type="button"
              onClick={handleReset}
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
              type="button"
              onClick={handleCopy}
              disabled={!result}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
                color: result ? "var(--color-text-primary)" : "var(--color-text-muted)",
                fontWeight: 600,
                fontSize: "0.92rem",
                cursor: result ? "pointer" : "not-allowed",
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
            padding: "24px",
          }}
        >
          <h3 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>Hasil Kalkulasi Subnet IPv4</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              fontFamily: "var(--font-mono)",
            }}
          >
            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>IP Address / Kelas</div>
              <div style={{ fontWeight: 700 }}>
                {result.ip} <span style={{ fontSize: "0.75rem", color: "var(--color-primary-600)" }}>({result.ipClass})</span>
              </div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Subnet Mask</div>
              <div style={{ fontWeight: 700 }}>
                {result.mask} (/{result.prefix})
              </div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Network Address</div>
              <div style={{ fontWeight: 700, color: "var(--color-primary-600)" }}>{result.network}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Broadcast Address</div>
              <div style={{ fontWeight: 700 }}>{result.broadcast}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Wildcard Mask</div>
              <div style={{ fontWeight: 700 }}>{result.wildcard}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>First Usable Host</div>
              <div style={{ fontWeight: 700, color: "var(--color-success)" }}>{result.firstHost}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Last Usable Host</div>
              <div style={{ fontWeight: 700, color: "var(--color-success)" }}>{result.lastHost}</div>
            </div>

            <div style={{ padding: "14px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Total Usable Host</div>
              <div style={{ fontWeight: 700, color: "var(--color-success)" }}>
                {result.usableHosts.toLocaleString("id-ID")} Host
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
