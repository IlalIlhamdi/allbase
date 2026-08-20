"use client";

import { useState, useMemo } from "react";
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
  Server,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useNdt7SpeedTest } from "@/hooks/useNdt7SpeedTest";
import {
  formatSpeed,
  formatLatency,
} from "@/lib/speedtest/calculations";
import { evaluateConnectionQuality, speedToFraction } from "@/lib/speedTestQuality";
import styles from "./InternetSpeedTest.module.css";

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
  const {
    phase,
    currentSpeed,
    results,
    serverInfo,
    errorMessage,
    consentAccepted,
    setConsentAccepted,
    startTest,
    cancelTest,
    resetTest,
    isRunning,
  } = useNdt7SpeedTest();

  const [copied, setCopied] = useState<boolean>(false);
  const [showDataWarningDetails, setShowDataWarningDetails] = useState<boolean>(false);

  const copyResults = () => {
    if (phase !== "completed" && phase !== "cancelled") return;

    const dlText = results.downloadMbps !== null ? `${formatSpeed(results.downloadMbps)} Mbps` : "Tidak tersedia";
    const ulText = results.uploadMbps !== null ? `${formatSpeed(results.uploadMbps)} Mbps` : "Tidak tersedia";
    const pingText = results.pingMs !== null ? `${formatLatency(results.pingMs)} ms` : "Tidak tersedia";
    const jitterText = results.jitterMs !== null ? `${formatLatency(results.jitterMs)} ms` : "Tidak tersedia";

    const text = `ALLBASE Internet Speed Test
Download: ${dlText}
Upload: ${ulText}
Ping: ${pingText}
Jitter: ${jitterText}
Measurement engine: M-Lab NDT7
Tested at: allbase.my.id`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Connection Quality Evaluation
  const qualityEvaluation = useMemo(() => {
    if (phase !== "completed") return null;
    return evaluateConnectionQuality({
      download: results.downloadMbps,
      upload: results.uploadMbps,
      ping: results.pingMs,
      jitter: results.jitterMs,
    });
  }, [phase, results]);

  // Semicircle calculations (Center: 170, 160; Radius: 125)
  const arcRadius = 125;
  const arcLength = Math.PI * arcRadius; // ~392.7
  const gaugeFraction = speedToFraction(currentSpeed);
  const strokeDashoffset = arcLength * (1 - gaugeFraction);

  // Tip dot position along arc
  const tipX = 170 - arcRadius * Math.cos(gaugeFraction * Math.PI);
  const tipY = 160 - arcRadius * Math.sin(gaugeFraction * Math.PI);

  const getPhaseDisplay = () => {
    switch (phase) {
      case "idle":
        return "SIAP";
      case "discovering":
        return "MENCARI SERVER";
      case "download":
        return "DOWNLOAD";
      case "upload":
        return "UPLOAD";
      case "finalizing":
        return "MENYELESAIKAN";
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
    switch (phase) {
      case "idle":
        return {
          dotClass: styles.dotIdle,
          text: "Siap melakukan pengujian koneksi",
        };
      case "discovering":
        return {
          dotClass: styles.dotRunning,
          text: "Mencari server pengujian terdekat (M-Lab Locate)...",
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
      case "finalizing":
        return {
          dotClass: styles.dotRunning,
          text: "Menyelesaikan hasil pengukuran...",
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
        <div className={styles.engineBadge} title="Measurement Lab NDT7 Network Engine">
          <Gauge size={13} />
          <span>M-Lab NDT7</span>
        </div>
      </div>

      {/* Hero Intro */}
      <section className={styles.heroIntro}>
        <h1 className={styles.title}>Internet Speed Test</h1>
        <p className={styles.description}>
          Ukur kecepatan download, upload, ping, dan jitter koneksi internet secara real-time menggunakan Measurement Lab (M-Lab).
        </p>
      </section>

      {/* M-Lab Data Policy Consent Banner */}
      <div className={styles.consentBanner}>
        <label className={styles.consentLabel}>
          <input
            type="checkbox"
            className={styles.consentCheckbox}
            checked={consentAccepted}
            onChange={(e) => setConsentAccepted(e.target.checked)}
            disabled={isRunning}
          />
          <span>
            Dengan menjalankan tes, pengukuran jaringan akan dilakukan menggunakan <strong>Measurement Lab (M-Lab)</strong> dan data hasil pengujian akan dipublikasikan ke dataset riset terbuka sesuai kebijakan datanya.
          </span>
        </label>
        <div className={styles.consentFooter}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "var(--color-text-muted)" }}>
            <ShieldCheck size={14} color="var(--color-success)" />
            <span>Persetujuan Diperlukan</span>
          </div>
          <a
            href="https://www.measurementlab.net/data-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.consentLink}
            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            <span>Kebijakan Data M-Lab</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Compact Data Warning Notice */}
      <div className={styles.warningNotice}>
        <div className={styles.warningHeader}>
          <div className={styles.warningContent}>
            <AlertTriangle size={17} className={styles.warningIcon} />
            <span>Tes dapat menggunakan kuota data yang cukup besar.</span>
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
            Pengujian kecepatan mengunduh dan mengunggah aliran data streaming untuk mengukur throughput aktual via WebSocket ke server M-Lab terdekat. Rata-rata pengujian mengonsumsi sekitar 20 MB – 80 MB tergantung kapasitas bandwidth jaringan Anda.
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
              {results.pingMs !== null ? formatLatency(results.pingMs) : "—"}
              <span className={styles.latencyUnit}>ms</span>
            </span>
          </div>
          <div className={styles.latencyItem}>
            <span className={styles.latencyLabel}>JITTER</span>
            <span className={styles.latencyValue}>
              {results.jitterMs !== null ? formatLatency(results.jitterMs) : "—"}
              <span className={styles.latencyUnit}>ms</span>
            </span>
          </div>
        </div>

        {/* Big Semicircle Gauge */}
        <div className={styles.speedGaugeWrapper}>
          <svg
            className={styles.gaugeSvg}
            viewBox="0 0 340 185"
            aria-label={`Kecepatan saat ini ${formatSpeed(currentSpeed)} Mbps`}
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
                  phase === "idle" || phase === "cancelled"
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
            <div className={styles.speedValue}>{formatSpeed(currentSpeed)}</div>
            <div className={styles.speedUnit}>Mbps</div>
          </div>
        </div>

        {/* Live Status Line */}
        <div className={styles.statusLine}>
          <span className={`${styles.statusDot} ${statusInfo.dotClass}`} />
          <span>{statusInfo.text}</span>
        </div>

        {/* Discovered Server Info */}
        {serverInfo && (
          <div className={styles.serverChip}>
            <Server size={12} />
            <span>
              Server: {serverInfo.city ? `${serverInfo.city}, ` : ""}{serverInfo.country || "M-Lab Node"}
            </span>
          </div>
        )}

        {/* Interactive Controls */}
        <div className={styles.controlsWrapper}>
          {phase === "idle" && (
            <button
              type="button"
              className={styles.startButton}
              onClick={startTest}
              disabled={!consentAccepted}
              title={!consentAccepted ? "Harap setujui kebijakan data M-Lab terlebih dahulu" : "Mulai Tes Kecepatan"}
              aria-label="Mulai Pengujian Kecepatan Internet"
            >
              <Play size={18} fill="currentColor" />
              <span>MULAI TES</span>
            </button>
          )}

          {(phase === "discovering" ||
            phase === "download" ||
            phase === "upload" ||
            phase === "finalizing") && (
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

          {phase === "completed" && (
            <div className={styles.resultActions}>
              <button
                type="button"
                className={styles.restartButton}
                onClick={resetTest}
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

          {(phase === "cancelled" || phase === "error") && (
            <button
              type="button"
              className={styles.startButton}
              onClick={resetTest}
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
          className={`${styles.metricCard} ${phase === "download" ? styles.cardActive : ""}`}
        >
          <div className={styles.metricHeader}>
            <div className={`${styles.metricTitleGroup} ${styles.dlAccent}`}>
              <ArrowDown size={17} />
              <span>DOWNLOAD</span>
            </div>
          </div>
          <div className={styles.metricNumber}>
            {formatSpeed(results.downloadMbps)}
            <span className={styles.metricUnitSmall}>Mbps</span>
          </div>
        </div>

        <div
          className={`${styles.metricCard} ${phase === "upload" ? styles.cardActive : ""}`}
        >
          <div className={styles.metricHeader}>
            <div className={`${styles.metricTitleGroup} ${styles.ulAccent}`}>
              <ArrowUp size={17} />
              <span>UPLOAD</span>
            </div>
          </div>
          <div className={styles.metricNumber}>
            {formatSpeed(results.uploadMbps)}
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
            {formatLatency(results.pingMs)}
            <span className={styles.metricUnitSmall}>ms</span>
          </div>
        </div>

        <div className={styles.secondaryCard}>
          <div className={styles.secondaryLabel}>
            <Radio size={15} color="var(--color-text-muted)" />
            <span>Jitter</span>
          </div>
          <div className={styles.secondaryValue}>
            {formatLatency(results.jitterMs)}
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
