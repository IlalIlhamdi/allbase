"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Play,
  RotateCcw,
  Square,
  Copy,
  Check,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Activity,
  Radio,
  Award,
  ChevronLeft,
  Gauge,
  Tv,
  Gamepad2,
  Video,
  Globe,
} from "lucide-react";
import { evaluateConnectionQuality, speedToFraction } from "@/lib/speedTestQuality";
import styles from "./InternetSpeedTest.module.css";

type TestState =
  | "idle"
  | "preparing"
  | "latency"
  | "download"
  | "upload"
  | "completed"
  | "cancelled"
  | "error";

interface SpeedResults {
  downloadMbps: number | null;
  uploadMbps: number | null;
  pingMs: number | null;
  jitterMs: number | null;
}

// Scale ticks for dynamic semicircle gauge
const GAUGE_TICKS = [
  { value: 0, label: "0" },
  { value: 10, label: "10" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
  { value: 250, label: "250" },
  { value: 500, label: "500" },
  { value: 1000, label: "1G+" },
];

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
  const [showDataWarningDetails, setShowDataWarningDetails] = useState<boolean>(false);

  // Speed test engine reference
  const speedTestEngineRef = useRef<{ pause?: () => void; play?: () => void; results?: unknown } | null>(null);
  const isCancelledRef = useRef<boolean>(false);

  // Clean up engine on unmount
  useEffect(() => {
    return () => {
      isCancelledRef.current = true;
      if (speedTestEngineRef.current) {
        try {
          if (typeof speedTestEngineRef.current.pause === "function") {
            speedTestEngineRef.current.pause();
          }
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const runTest = async () => {
    isCancelledRef.current = false;
    setTestState("preparing");
    setCurrentSpeed(0);
    setResults({ downloadMbps: null, uploadMbps: null, pingMs: null, jitterMs: null });
    setErrorMessage("");
    setCopied(false);

    try {
      const SpeedTestModule = await import("@cloudflare/speedtest");
      const SpeedTest = SpeedTestModule.default;

      // Robust Cloudflare SpeedTest Configuration
      const engine = new SpeedTest({
        autoStart: false,
        measureDownloadLoadedLatency: false,
        measureUploadLoadedLatency: false,
        measurements: [
          { type: "latency", numPackets: 1 },
          { type: "download", bytes: 1e5, count: 1, bypassMinDuration: true },
          { type: "latency", numPackets: 10 },
          { type: "download", bytes: 1e5, count: 4 },
          { type: "download", bytes: 1e6, count: 4 },
          { type: "upload", bytes: 1e5, count: 4 },
          { type: "upload", bytes: 1e6, count: 3 },
          { type: "download", bytes: 1e7, count: 3 },
          { type: "upload", bytes: 1e7, count: 2 },
          { type: "download", bytes: 25e6, count: 2 },
        ],
      });

      speedTestEngineRef.current = engine;

      // Event listener for real-time measurements
      engine.onResultsChange = ({ type }: { type?: string }) => {
        if (isCancelledRef.current) return;
        const res = engine.results as {
          getUnloadedLatency?: () => number | undefined;
          getUnloadedJitter?: () => number | null | undefined;
          getDownloadBandwidth?: () => number | undefined;
          getDownloadBandwidthPoints?: () => Array<{ bps: number }>;
          getUploadBandwidth?: () => number | undefined;
          getUploadBandwidthPoints?: () => Array<{ bps: number }>;
        } | null;

        if (!res) return;

        // Extract latency & jitter
        const pingVal = typeof res.getUnloadedLatency === "function" ? res.getUnloadedLatency() : undefined;
        const jitterVal = typeof res.getUnloadedJitter === "function" ? res.getUnloadedJitter() : undefined;

        if (pingVal !== undefined && Number.isFinite(pingVal) && pingVal > 0) {
          setResults((prev) => ({
            ...prev,
            pingMs: pingVal,
            jitterMs: jitterVal !== null && jitterVal !== undefined && Number.isFinite(jitterVal) ? jitterVal : prev.jitterMs,
          }));
        }

        // Handle Download Phase
        if (type === "download") {
          setTestState("download");
          const points = typeof res.getDownloadBandwidthPoints === "function" ? res.getDownloadBandwidthPoints() : [];
          const latestBps = points.length > 0 ? points[points.length - 1]?.bps : res.getDownloadBandwidth?.();
          const bps = Number(latestBps || 0);
          if (bps > 0) {
            const mbps = bps / 1_000_000;
            setCurrentSpeed(mbps);
            setResults((prev) => ({ ...prev, downloadMbps: mbps }));
          }
        } else if (type === "upload") {
          // Handle Upload Phase
          setTestState("upload");
          const points = typeof res.getUploadBandwidthPoints === "function" ? res.getUploadBandwidthPoints() : [];
          const latestBps = points.length > 0 ? points[points.length - 1]?.bps : res.getUploadBandwidth?.();
          const bps = Number(latestBps || 0);
          if (bps > 0) {
            const mbps = bps / 1_000_000;
            setCurrentSpeed(mbps);
            setResults((prev) => ({ ...prev, uploadMbps: mbps }));
          }
        } else if (type === "latency") {
          setTestState("latency");
        }
      };

      // Event listener when all measurement suites complete
      engine.onFinish = (finalResults: any) => {
        if (isCancelledRef.current) return;

        setTestState("completed");
        setCurrentSpeed(0);

        const summary =
          typeof finalResults?.getSummary === "function"
            ? finalResults.getSummary()
            : (finalResults as unknown as Record<string, number>) || {};

        const dlBps = Number(finalResults?.getDownloadBandwidth?.() || summary.download || 0);
        const ulBps = Number(finalResults?.getUploadBandwidth?.() || summary.upload || 0);
        const pMs = Number(finalResults?.getUnloadedLatency?.() || summary.latency || 0);
        const jMs = Number(finalResults?.getUnloadedJitter?.() || summary.jitter || 0);

        setResults((prev) => ({
          downloadMbps: dlBps > 0 ? dlBps / 1_000_000 : prev.downloadMbps,
          uploadMbps: ulBps > 0 ? ulBps / 1_000_000 : prev.uploadMbps,
          pingMs: pMs > 0 ? pMs : prev.pingMs,
          jitterMs: jMs > 0 ? jMs : prev.jitterMs,
        }));
      };

      engine.onError = (err: unknown) => {
        if (isCancelledRef.current) return;
        setTestState("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Pengujian mengalami kendala koneksi."
        );
      };

      engine.play();
    } catch {
      if (isCancelledRef.current) return;
      setTestState("error");
      setErrorMessage("Gagal memuat engine pengujian kecepatan.");
    }
  };

  const cancelTest = () => {
    isCancelledRef.current = true;
    if (speedTestEngineRef.current) {
      try {
        if (typeof speedTestEngineRef.current.pause === "function") {
          speedTestEngineRef.current.pause();
        }
      } catch {
        // ignore
      }
    }
    setTestState("cancelled");
    setCurrentSpeed(0);
  };

  const copyResults = () => {
    if (testState !== "completed" && testState !== "cancelled") return;

    const dlText = results.downloadMbps ? `${results.downloadMbps.toFixed(2)} Mbps` : "—";
    const ulText = results.uploadMbps ? `${results.uploadMbps.toFixed(2)} Mbps` : "—";
    const pingText = results.pingMs ? `${results.pingMs.toFixed(1)} ms` : "—";
    const jitterText = results.jitterMs ? `${results.jitterMs.toFixed(1)} ms` : "—";

    const text = `ALLBASE Internet Speed Test
Download: ${dlText}
Upload: ${ulText}
Ping: ${pingText}
Jitter: ${jitterText}
Tested at: allbase.my.id`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Connection Quality Evaluation
  const qualityEvaluation = useMemo(() => {
    if (testState !== "completed") return null;
    return evaluateConnectionQuality({
      download: results.downloadMbps,
      upload: results.uploadMbps,
      ping: results.pingMs,
      jitter: results.jitterMs,
    });
  }, [testState, results]);

  // Semicircle calculations (Center: 170, 160; Radius: 125)
  const arcRadius = 125;
  const arcLength = Math.PI * arcRadius; // ~392.7
  const gaugeFraction = speedToFraction(currentSpeed);
  const strokeDashoffset = arcLength * (1 - gaugeFraction);

  // Tip dot position along arc
  const tipX = 170 - arcRadius * Math.cos(gaugeFraction * Math.PI);
  const tipY = 160 - arcRadius * Math.sin(gaugeFraction * Math.PI);

  const getPhaseDisplay = () => {
    switch (testState) {
      case "idle":
        return "SIAP";
      case "preparing":
        return "MENYIAPKAN";
      case "latency":
        return "PING / JITTER";
      case "download":
        return "DOWNLOAD";
      case "upload":
        return "UPLOAD";
      case "completed":
        return "SELESAI";
      case "cancelled":
        return "DIBATALKAN";
      case "error":
        return "ERROR";
      default:
        return "SPEED TEST";
    }
  };

  const getStatusLine = () => {
    switch (testState) {
      case "idle":
        return {
          dotClass: styles.dotIdle,
          text: "Siap melakukan pengujian koneksi",
        };
      case "preparing":
        return {
          dotClass: styles.dotRunning,
          text: "Menghubungkan ke Edge Server Cloudflare...",
        };
      case "latency":
        return {
          dotClass: styles.dotRunning,
          text: "Mengukur latensi ping dan jitter...",
        };
      case "download":
        return {
          dotClass: styles.dotRunning,
          text: "Mengukur kecepatan download...",
        };
      case "upload":
        return {
          dotClass: styles.dotRunning,
          text: "Mengukur kecepatan upload...",
        };
      case "completed":
        return {
          dotClass: styles.dotSuccess,
          text: "✓ Pengujian selesai",
        };
      case "cancelled":
        return {
          dotClass: styles.dotCancelled,
          text: "○ Pengujian dibatalkan",
        };
      case "error":
        return {
          dotClass: styles.dotError,
          text: errorMessage || "Pengujian mengalami kendala koneksi.",
        };
    }
  };

  const statusInfo = getStatusLine();

  return (
    <div className={styles.container}>
      {/* Top Breadcrumb Navigation */}
      <div className={styles.toolBar}>
        <Link href="/#tools" className={styles.backButton} aria-label="Kembali ke Tools">
          <ChevronLeft size={18} />
          <span>Tools</span>
        </Link>
        <span className={styles.barTitle}>Speed Test</span>
        <div className={styles.engineBadge} title="Cloudflare Speedtest Network Engine">
          <Gauge size={13} />
          <span>Cloudflare Edge</span>
        </div>
      </div>

      {/* Hero Intro */}
      <section className={styles.heroIntro}>
        <h1 className={styles.title}>Internet Speed Test</h1>
        <p className={styles.description}>
          Ukur kecepatan download, upload, ping, dan jitter koneksi internet secara real-time.
        </p>
      </section>

      {/* Compact Data Warning Notice */}
      <div className={styles.warningNotice}>
        <div className={styles.warningHeader}>
          <div className={styles.warningContent}>
            <AlertTriangle size={17} className={styles.warningIcon} />
            <span>Tes dapat menggunakan kuota data cukup besar.</span>
          </div>
          <button
            type="button"
            className={styles.warningToggleBtn}
            onClick={() => setShowDataWarningDetails((prev) => !prev)}
            aria-expanded={showDataWarningDetails}
          >
            {showDataWarningDetails ? "Tutup info" : "Pelajari penggunaan data"}
          </button>
        </div>
        {showDataWarningDetails && (
          <div className={styles.warningDetails}>
            Pengujian kecepatan mengunduh dan mengunggah sampel file acak untuk mengukur bandwidth aktual.
            Rata-rata pengujian dapat mengonsumsi kuota sekitar 20 MB – 80 MB tergantung kecepatan koneksi Anda.
          </div>
        )}
      </div>

      {/* Main Meter & Gauge Arena */}
      <div className={styles.testArena} aria-live="polite">
        {/* Latency Summary Above Gauge */}
        <div className={styles.latencySummary}>
          <div className={styles.latencyItem}>
            <span className={styles.latencyLabel}>PING</span>
            <span className={styles.latencyValue}>
              {results.pingMs !== null ? results.pingMs.toFixed(0) : "—"}
              <span className={styles.latencyUnit}>ms</span>
            </span>
          </div>
          <div className={styles.latencyItem}>
            <span className={styles.latencyLabel}>JITTER</span>
            <span className={styles.latencyValue}>
              {results.jitterMs !== null ? results.jitterMs.toFixed(0) : "—"}
              <span className={styles.latencyUnit}>ms</span>
            </span>
          </div>
        </div>

        {/* Big Semicircle Gauge */}
        <div className={styles.speedGaugeWrapper}>
          <svg
            className={styles.gaugeSvg}
            viewBox="0 0 340 185"
            aria-label={`Kecepatan saat ini ${currentSpeed.toFixed(2)} Mbps`}
            role="img"
          >
            <defs>
              {/* Vibrant ALLBASE Blue to Cyan to Emerald Gradient */}
              <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              {/* Glow Filter for Active Needle Tip */}
              <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Arc Track */}
            <path
              d="M 45 160 A 125 125 0 0 1 295 160"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Tick Marks on Arc */}
            {GAUGE_TICKS.map((tick) => {
              const fraction = speedToFraction(tick.value);
              const angleRad = fraction * Math.PI;
              const rInner = 136;
              const rOuter = 143;
              const x1 = 170 - rInner * Math.cos(angleRad);
              const y1 = 160 - rInner * Math.sin(angleRad);
              const x2 = 170 - rOuter * Math.cos(angleRad);
              const y2 = 160 - rOuter * Math.sin(angleRad);
              const textR = 153;
              const tx = 170 - textR * Math.cos(angleRad);
              const ty = 160 - textR * Math.sin(angleRad);

              return (
                <g key={tick.value}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="var(--color-text-muted)"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  <text
                    x={tx}
                    y={ty + 3}
                    textAnchor="middle"
                    fill="var(--color-text-muted)"
                    fontSize="9.5"
                    fontFamily="var(--font-heading)"
                    fontWeight="600"
                    opacity="0.75"
                  >
                    {tick.label}
                  </text>
                </g>
              );
            })}

            {/* Active Progress Arc */}
            <path
              d="M 45 160 A 125 125 0 0 1 295 160"
              fill="none"
              stroke="url(#speedGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition:
                  testState === "idle" || testState === "cancelled"
                    ? "stroke-dashoffset 400ms ease-out"
                    : "stroke-dashoffset 150ms cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
            />

            {/* Needle Tip Glowing Dot */}
            {gaugeFraction > 0.005 && (
              <circle
                cx={tipX}
                cy={tipY}
                r="6.5"
                fill="#ffffff"
                stroke="#06b6d4"
                strokeWidth="3.5"
                filter="url(#gaugeGlow)"
              />
            )}
          </svg>

          {/* Large Speed Value in Center of Semicircle */}
          <div className={styles.gaugeCenterData}>
            <span className={styles.phaseTag}>{getPhaseDisplay()}</span>
            <div className={styles.speedValue}>{currentSpeed.toFixed(2)}</div>
            <div className={styles.speedUnit}>Mbps</div>
          </div>
        </div>

        {/* Live Status Line */}
        <div className={styles.statusLine}>
          <span className={`${styles.statusDot} ${statusInfo.dotClass}`} />
          <span>{statusInfo.text}</span>
        </div>

        {/* Interactive Controls */}
        <div className={styles.controlsWrapper}>
          {testState === "idle" && (
            <button
              type="button"
              className={styles.startButton}
              onClick={runTest}
              aria-label="Mulai Pengujian Kecepatan Internet"
            >
              <Play size={18} fill="currentColor" />
              <span>MULAI TES</span>
            </button>
          )}

          {(testState === "preparing" ||
            testState === "latency" ||
            testState === "download" ||
            testState === "upload") && (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={cancelTest}
              aria-label="Batalkan Pengujian Kecepatan"
            >
              <Square size={16} fill="currentColor" />
              <span>Batalkan Tes</span>
            </button>
          )}

          {testState === "completed" && (
            <div className={styles.resultActions}>
              <button
                type="button"
                className={styles.restartButton}
                onClick={runTest}
                aria-label="Uji Ulang Kecepatan Internet"
              >
                <RotateCcw size={16} />
                <span>Tes Lagi</span>
              </button>
              <button
                type="button"
                className={`${styles.copyButton} ${copied ? styles.copyButtonCopied : ""}`}
                onClick={copyResults}
                aria-label="Salin Hasil Pengujian ke Clipboard"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? "Hasil Disalin!" : "Salin Hasil"}</span>
              </button>
            </div>
          )}

          {(testState === "cancelled" || testState === "error") && (
            <button
              type="button"
              className={styles.startButton}
              onClick={runTest}
              aria-label="Mulai Ulang Pengujian Kecepatan"
            >
              <RotateCcw size={18} />
              <span>Mulai Ulang</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Metrics (Download & Upload) */}
      <div className={styles.primaryMetrics}>
        <div
          className={`${styles.metricCard} ${testState === "download" ? styles.cardActive : ""}`}
        >
          <div className={styles.metricHeader}>
            <div className={`${styles.metricTitleGroup} ${styles.dlAccent}`}>
              <ArrowDown size={17} />
              <span>DOWNLOAD</span>
            </div>
          </div>
          <div className={styles.metricNumber}>
            {results.downloadMbps !== null ? results.downloadMbps.toFixed(2) : "—"}
            <span className={styles.metricUnitSmall}>Mbps</span>
          </div>
        </div>

        <div
          className={`${styles.metricCard} ${testState === "upload" ? styles.cardActive : ""}`}
        >
          <div className={styles.metricHeader}>
            <div className={`${styles.metricTitleGroup} ${styles.ulAccent}`}>
              <ArrowUp size={17} />
              <span>UPLOAD</span>
            </div>
          </div>
          <div className={styles.metricNumber}>
            {results.uploadMbps !== null ? results.uploadMbps.toFixed(2) : "—"}
            <span className={styles.metricUnitSmall}>Mbps</span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics (Ping & Jitter) */}
      <div className={styles.secondaryMetrics}>
        <div className={styles.secondaryCard}>
          <div className={styles.secondaryLabel}>
            <Activity size={15} color="var(--color-primary-500)" />
            <span>Ping</span>
          </div>
          <div className={styles.secondaryValue}>
            {results.pingMs !== null ? results.pingMs.toFixed(1) : "—"}
            <span className={styles.metricUnitSmall}>ms</span>
          </div>
        </div>

        <div className={styles.secondaryCard}>
          <div className={styles.secondaryLabel}>
            <Radio size={15} color="var(--color-text-muted)" />
            <span>Jitter</span>
          </div>
          <div className={styles.secondaryValue}>
            {results.jitterMs !== null ? results.jitterMs.toFixed(1) : "—"}
            <span className={styles.metricUnitSmall}>ms</span>
          </div>
        </div>
      </div>

      {/* Connection Quality Assessment Section (After completion) */}
      {qualityEvaluation && (
        <section className={styles.qualitySection} aria-label="Analisis Kualitas Koneksi Internet">
          <div className={styles.qualityHeader}>
            <h2 className={styles.qualityTitle}>
              <Award size={20} color="var(--color-primary-600)" />
              <span>Kualitas Koneksi</span>
            </h2>
            <span
              className={`${styles.qualityBadge} ${
                qualityEvaluation.overall.status === "great"
                  ? styles.badgeGreat
                  : qualityEvaluation.overall.status === "good"
                  ? styles.badgeGood
                  : qualityEvaluation.overall.status === "average"
                  ? styles.badgeAverage
                  : styles.badgePoor
              }`}
            >
              ● {qualityEvaluation.overall.level}
            </span>
          </div>

          <div className={styles.qualityList}>
            {/* Streaming 4K */}
            <div className={styles.qualityRow}>
              <div className={styles.qualityCategory}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Tv size={15} color="var(--color-primary-500)" />
                  <span className={styles.categoryName}>Streaming 4K</span>
                </div>
                <span className={styles.categoryDetail}>{qualityEvaluation.streaming.detail}</span>
              </div>
              <span
                className={`${styles.qualityBadge} ${
                  qualityEvaluation.streaming.status === "great"
                    ? styles.badgeGreat
                    : qualityEvaluation.streaming.status === "good"
                    ? styles.badgeGood
                    : qualityEvaluation.streaming.status === "average"
                    ? styles.badgeAverage
                    : styles.badgePoor
                }`}
              >
                ● {qualityEvaluation.streaming.level}
              </span>
            </div>

            {/* Gaming Online */}
            <div className={styles.qualityRow}>
              <div className={styles.qualityCategory}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Gamepad2 size={15} color="var(--color-success)" />
                  <span className={styles.categoryName}>Gaming</span>
                </div>
                <span className={styles.categoryDetail}>{qualityEvaluation.gaming.detail}</span>
              </div>
              <span
                className={`${styles.qualityBadge} ${
                  qualityEvaluation.gaming.status === "great"
                    ? styles.badgeGreat
                    : qualityEvaluation.gaming.status === "good"
                    ? styles.badgeGood
                    : qualityEvaluation.gaming.status === "average"
                    ? styles.badgeAverage
                    : styles.badgePoor
                }`}
              >
                ● {qualityEvaluation.gaming.level}
              </span>
            </div>

            {/* Video Call */}
            <div className={styles.qualityRow}>
              <div className={styles.qualityCategory}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Video size={15} color="#06b6d4" />
                  <span className={styles.categoryName}>Video Call</span>
                </div>
                <span className={styles.categoryDetail}>{qualityEvaluation.videoCall.detail}</span>
              </div>
              <span
                className={`${styles.qualityBadge} ${
                  qualityEvaluation.videoCall.status === "great"
                    ? styles.badgeGreat
                    : qualityEvaluation.videoCall.status === "good"
                    ? styles.badgeGood
                    : qualityEvaluation.videoCall.status === "average"
                    ? styles.badgeAverage
                    : styles.badgePoor
                }`}
              >
                ● {qualityEvaluation.videoCall.level}
              </span>
            </div>

            {/* Web Browsing */}
            <div className={styles.qualityRow}>
              <div className={styles.qualityCategory}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Globe size={15} color="var(--color-primary-600)" />
                  <span className={styles.categoryName}>Browsing</span>
                </div>
                <span className={styles.categoryDetail}>{qualityEvaluation.browsing.detail}</span>
              </div>
              <span
                className={`${styles.qualityBadge} ${
                  qualityEvaluation.browsing.status === "great"
                    ? styles.badgeGreat
                    : qualityEvaluation.browsing.status === "good"
                    ? styles.badgeGood
                    : qualityEvaluation.browsing.status === "average"
                    ? styles.badgeAverage
                    : styles.badgePoor
                }`}
              >
                ● {qualityEvaluation.browsing.level}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Copy Toast Notification */}
      {copied && (
        <div className={styles.toast} role="status" aria-live="polite">
          <Check size={16} color="#10b981" />
          <span>✓ Hasil disalin ke clipboard</span>
        </div>
      )}
    </div>
  );
}
