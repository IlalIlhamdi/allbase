"use client";

import { useState, useEffect, useRef } from "react";
import { Gauge, Play, RotateCcw, XCircle, Copy, AlertTriangle, CheckCircle, Activity, ArrowDownCircle, ArrowUpCircle, Radio, Award } from "lucide-react";

type TestState =
  | "idle"
  | "preparing"
  | "latency"
  | "download"
  | "upload"
  | "analyzing"
  | "completed"
  | "cancelled"
  | "error";

interface SpeedResults {
  downloadMbps: number | null;
  uploadMbps: number | null;
  pingMs: number | null;
  jitterMs: number | null;
}

export default function InternetSpeedTest() {
  const [testState, setTestState] = useState<TestState>("idle");
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [results, setResults] = useState<SpeedResults>({
    downloadMbps: null,
    uploadMbps: null,
    pingMs: null,
    jitterMs: null,
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const speedTestEngineRef = useRef<unknown>(null);

  useEffect(() => {
    return () => {
      if (speedTestEngineRef.current) {
        try {
          const engine = speedTestEngineRef.current as { pause?: () => void };
          if (typeof engine.pause === "function") engine.pause();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const runTest = async () => {
    setTestState("preparing");
    setCurrentSpeed(0);
    setResults({ downloadMbps: null, uploadMbps: null, pingMs: null, jitterMs: null });
    setErrorMessage("");
    setCopied(false);

    try {
      const SpeedTestModule = await import("@cloudflare/speedtest");
      const SpeedTest = SpeedTestModule.default;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const engine: any = new SpeedTest({
        autoStart: false,
      });

      speedTestEngineRef.current = engine;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      engine.onResultsChange = (data: any) => {
        if (!data) return;
        const type = data.type || "";

        if (type === "latency" && data.latency) {
          setTestState("latency");
          const p = Number(data.latency);
          const j = Number(data.jitter || 0);
          setResults((prev) => ({ ...prev, pingMs: p, jitterMs: j }));
        }

        if (type === "download" && data.download) {
          setTestState("download");
          const bps = Number(data.download);
          const mbps = bps / 1_000_000;
          setCurrentSpeed(mbps);
          setResults((prev) => ({ ...prev, downloadMbps: mbps }));
        }

        if (type === "upload" && data.upload) {
          setTestState("upload");
          const bps = Number(data.upload);
          const mbps = bps / 1_000_000;
          setCurrentSpeed(mbps);
          setResults((prev) => ({ ...prev, uploadMbps: mbps }));
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      engine.onFinish = (finalResults: any) => {
        setTestState("completed");
        setCurrentSpeed(0);

        const summary = typeof finalResults?.getSummary === "function" ? finalResults.getSummary() : finalResults || {};
        const dlBps = Number(summary.download || summary.downloadSpeed || 0);
        const ulBps = Number(summary.upload || summary.uploadSpeed || 0);
        const pMs = Number(summary.latency || summary.ping || 0);
        const jMs = Number(summary.jitter || 0);

        setResults({
          downloadMbps: dlBps > 0 ? dlBps / 1_000_000 : null,
          uploadMbps: ulBps > 0 ? ulBps / 1_000_000 : null,
          pingMs: pMs > 0 ? pMs : null,
          jitterMs: jMs > 0 ? jMs : null,
        });
      };

      engine.onError = (err: unknown) => {
        setTestState("error");
        setErrorMessage(err instanceof Error ? err.message : "Pengujian mengalami kendala koneksi.");
      };

      engine.play();
    } catch {
      setTestState("error");
      setErrorMessage("Gagal memuat engine pengujian kecepatan.");
    }
  };

  const cancelTest = () => {
    if (speedTestEngineRef.current) {
      try {
        const engine = speedTestEngineRef.current as { pause?: () => void };
        if (typeof engine.pause === "function") engine.pause();
      } catch {
        // ignore
      }
    }
    setTestState("cancelled");
    setCurrentSpeed(0);
  };

  const copyResults = () => {
    if (testState !== "completed") return;
    const text = `ALLBASE Internet Speed Test Results:
- Download: ${results.downloadMbps ? results.downloadMbps.toFixed(2) : "—"} Mbps
- Upload: ${results.uploadMbps ? results.uploadMbps.toFixed(2) : "—"} Mbps
- Ping: ${results.pingMs ? results.pingMs.toFixed(1) : "—"} ms
- Jitter: ${results.jitterMs ? results.jitterMs.toFixed(1) : "—"} ms
Uji koneksi Anda di https://allbase.my.id/tools/internet-speed-test/`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const getStreamingQuality = () => {
    if (!results.downloadMbps) return "Belum Diuji";
    if (results.downloadMbps >= 25) return "Sangat Baik (4K Ultra HD)";
    if (results.downloadMbps >= 10) return "Baik (1080p Full HD)";
    return "Cukup (720p HD)";
  };

  const getGamingQuality = () => {
    if (!results.pingMs) return "Belum Diuji";
    if (results.pingMs <= 30 && (results.jitterMs || 0) <= 10) return "Sangat Baik (Low Latency)";
    if (results.pingMs <= 60) return "Baik";
    return "Cukup / High Latency";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Intro Box */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
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
            <Gauge size={14} /> Cloudflare Measurement Engine
          </span>
          <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
            Edge Network API
          </span>
        </div>
        <h1 style={{ fontSize: "1.6rem", marginBottom: "6px" }}>Internet Speed Test</h1>
        <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)" }}>
          Uji performa bandwidth Download, Upload, Ping, Jitter, serta penilaian kualitas koneksi real-time.
        </p>
      </div>

      {/* Warning Box */}
      <div
        style={{
          backgroundColor: "var(--color-warning-soft)",
          border: "1px solid var(--color-warning)",
          borderRadius: "var(--radius-md)",
          padding: "16px 20px",
          display: "flex",
          gap: "14px",
          color: "var(--color-text-primary)",
        }}
      >
        <AlertTriangle size={20} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: "2px" }}>Peringatan Penggunaan Data</div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
            Tes kecepatan dapat menggunakan kuota data dalam jumlah cukup besar. Pastikan Anda memperhatikan batas kuota internet seluler Anda.
          </div>
        </div>
      </div>

      {/* Main Meter & Panel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "32px 24px",
        }}
      >
        {/* Left Gauge Display */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                padding: "4px 12px",
                borderRadius: "var(--radius-pill)",
                backgroundColor: testState === "completed" ? "var(--color-success-soft)" : "var(--color-primary-50)",
                color: testState === "completed" ? "var(--color-success)" : "var(--color-primary-600)",
                textTransform: "uppercase",
              }}
            >
              {testState === "idle"
                ? "SIAP"
                : testState === "completed"
                ? "SELESAI"
                : testState === "cancelled"
                ? "DIBATALKAN"
                : testState === "error"
                ? "ERROR"
                : `PENGUJIAN (${testState})`}
            </span>
          </div>

          {/* SVG Speedometer Gauge */}
          <div style={{ position: "relative", width: "240px", height: "160px" }}>
            <svg viewBox="0 0 320 200" style={{ width: "100%", height: "100%" }}>
              <path
                d="M 40 160 A 120 120 0 0 1 280 160"
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <path
                d="M 40 160 A 120 120 0 0 1 280 160"
                fill="none"
                stroke="var(--color-primary-600)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray="376.99"
                strokeDashoffset={376.99 - (Math.min(currentSpeed, 100) / 100) * 376.99}
                style={{ transition: "stroke-dashoffset 200ms ease" }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: 0,
                right: 0,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono)", lineHeight: 1 }}>
                {currentSpeed.toFixed(2)}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Mbps</div>
            </div>
          </div>
        </div>

        {/* Right Info Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "6px" }}>Analisis Koneksi Real-time</h2>
            <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)" }}>
              {testState === "idle"
                ? "Klik Mulai Tes untuk menguji performa koneksi internet."
                : testState === "completed"
                ? "Pengujian selesai. Seluruh indikator telah diukur."
                : testState === "cancelled"
                ? "Pengujian dibatalkan oleh pengguna."
                : testState === "error"
                ? errorMessage
                : "Sedang mengukur trafik data..."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "auto" }}>
            {testState === "idle" || testState === "completed" ? (
              <button
                onClick={runTest}
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
                <Play size={16} /> {testState === "completed" ? "Tes Ulang" : "Mulai Tes"}
              </button>
            ) : testState === "cancelled" || testState === "error" ? (
              <button
                onClick={runTest}
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
                <RotateCcw size={16} /> Mulai Ulang Tes
              </button>
            ) : (
              <button
                onClick={cancelTest}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--color-danger)",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                }}
              >
                <XCircle size={16} /> Batalkan
              </button>
            )}

            <button
              onClick={copyResults}
              disabled={testState !== "completed"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
                color: testState === "completed" ? "var(--color-text-primary)" : "var(--color-text-muted)",
                fontWeight: 600,
                fontSize: "0.92rem",
                cursor: testState === "completed" ? "pointer" : "not-allowed",
              }}
            >
              {copied ? <CheckCircle size={16} color="var(--color-success)" /> : <Copy size={16} />}
              {copied ? "Hasil Disalin!" : "Salin Hasil"}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-primary-600)", marginBottom: "8px" }}>
            <ArrowDownCircle size={18} />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Download</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-mono)" }}>
            {results.downloadMbps ? results.downloadMbps.toFixed(2) : "—"}{" "}
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Mbps</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-success)", marginBottom: "8px" }}>
            <ArrowUpCircle size={18} />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Upload</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-mono)" }}>
            {results.uploadMbps ? results.uploadMbps.toFixed(2) : "—"}{" "}
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Mbps</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-warning)", marginBottom: "8px" }}>
            <Activity size={18} />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Ping (Latency)</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-mono)" }}>
            {results.pingMs ? results.pingMs.toFixed(1) : "—"}{" "}
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>ms</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-primary-400)", marginBottom: "8px" }}>
            <Radio size={18} />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Jitter</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-mono)" }}>
            {results.jitterMs ? results.jitterMs.toFixed(1) : "—"}{" "}
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>ms</span>
          </div>
        </div>
      </div>

      {/* Connection Quality Rating */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "24px",
        }}
      >
        <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Award size={20} color="var(--color-primary-600)" /> Rating Kualitas Koneksi
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          <div style={{ padding: "16px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Streaming Video</div>
            <div style={{ fontWeight: 700, color: "var(--color-primary-600)" }}>{getStreamingQuality()}</div>
          </div>

          <div style={{ padding: "16px", backgroundColor: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>Gaming Online</div>
            <div style={{ fontWeight: 700, color: "var(--color-success)" }}>{getGamingQuality()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
