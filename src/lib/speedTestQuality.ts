export type QualityLevel = "Sangat Baik" | "Baik" | "Cukup" | "Kurang";
export type QualityStatus = "great" | "good" | "average" | "poor";

export interface QualityMetric {
  level: QualityLevel;
  detail: string;
  status: QualityStatus;
}

export interface ConnectionQualityResult {
  streaming: QualityMetric;
  gaming: QualityMetric;
  videoCall: QualityMetric;
  browsing: QualityMetric;
  overall: QualityMetric;
}

export interface SpeedTestMetricsInput {
  download: number | null;
  upload: number | null;
  ping: number | null;
  jitter: number | null;
}

/**
 * Smooth dynamic mapping of speed (in Mbps) to gauge progress fraction (0.0 to 1.0)
 */
export function speedToFraction(speed: number): number {
  if (speed <= 0) return 0;
  if (speed <= 10) {
    // 0 to 10 Mbps -> 0% to 25% of the gauge
    return (speed / 10) * 0.25;
  }
  if (speed <= 50) {
    // 10 to 50 Mbps -> 25% to 50%
    return 0.25 + ((speed - 10) / 40) * 0.25;
  }
  if (speed <= 100) {
    // 50 to 100 Mbps -> 50% to 70%
    return 0.5 + ((speed - 50) / 50) * 0.2;
  }
  if (speed <= 250) {
    // 100 to 250 Mbps -> 70% to 85%
    return 0.7 + ((speed - 100) / 150) * 0.15;
  }
  if (speed <= 500) {
    // 250 to 500 Mbps -> 85% to 95%
    return 0.85 + ((speed - 250) / 250) * 0.1;
  }
  // 500 to 1000+ Mbps -> 95% to 100%
  return Math.min(1, 0.95 + ((speed - 500) / 500) * 0.05);
}

export function evaluateConnectionQuality(input: SpeedTestMetricsInput): ConnectionQualityResult | null {
  const { download, upload, ping, jitter } = input;

  if (download === null && upload === null && ping === null && jitter === null) {
    return null;
  }

  const dl = download ?? 0;
  const ul = upload ?? 0;
  const p = ping ?? 999;
  const j = jitter ?? 999;

  // Streaming Assessment
  let streaming: QualityMetric;
  if (dl >= 25) {
    streaming = { level: "Sangat Baik", detail: "4K Ultra HD lancar tanpa buffering", status: "great" };
  } else if (dl >= 10) {
    streaming = { level: "Baik", detail: "1080p Full HD jernih dan stabil", status: "good" };
  } else if (dl >= 4) {
    streaming = { level: "Cukup", detail: "720p HD cukup nyaman", status: "average" };
  } else {
    streaming = { level: "Kurang", detail: "SD 480p / berpotensi buffering", status: "poor" };
  }

  // Gaming Assessment
  let gaming: QualityMetric;
  if (p <= 25 && j <= 6) {
    gaming = { level: "Sangat Baik", detail: "Latensi sangat rendah & mulus", status: "great" };
  } else if (p <= 55 && j <= 15) {
    gaming = { level: "Baik", detail: "Responsif untuk multiplayer online", status: "good" };
  } else if (p <= 95 && j <= 30) {
    gaming = { level: "Cukup", detail: "Cukup stabil untuk casual gaming", status: "average" };
  } else {
    gaming = { level: "Kurang", detail: "Latensi tinggi / berisiko lag", status: "poor" };
  }

  // Video Call (RTC) Assessment
  let videoCall: QualityMetric;
  if (dl >= 10 && ul >= 5 && p <= 50 && j <= 10) {
    videoCall = { level: "Sangat Baik", detail: "HD 1080p multi-party tanpa delay", status: "great" };
  } else if (dl >= 3 && ul >= 1.5 && p <= 80 && j <= 20) {
    videoCall = { level: "Baik", detail: "720p stabil untuk meeting & call", status: "good" };
  } else if (dl >= 1 && ul >= 0.5 && p <= 120) {
    videoCall = { level: "Cukup", detail: "Standar video call / voice call", status: "average" };
  } else {
    videoCall = { level: "Kurang", detail: "Audio/video berpotensi putus-putus", status: "poor" };
  }

  // Browsing Assessment
  let browsing: QualityMetric;
  if (dl >= 15 && p <= 45) {
    browsing = { level: "Sangat Baik", detail: "Loading halaman web instan", status: "great" };
  } else if (dl >= 5 && p <= 90) {
    browsing = { level: "Baik", detail: "Cepat dan nyaman untuk browsing", status: "good" };
  } else if (dl >= 1) {
    browsing = { level: "Cukup", detail: "Waktu loading web standar", status: "average" };
  } else {
    browsing = { level: "Kurang", detail: "Lambat memuat konten berat", status: "poor" };
  }

  // Overall Assessment
  const statusScores = { great: 4, good: 3, average: 2, poor: 1 };
  const totalScore =
    statusScores[streaming.status] +
    statusScores[gaming.status] +
    statusScores[videoCall.status] +
    statusScores[browsing.status];
  const avg = totalScore / 4;

  let overall: QualityMetric;
  if (avg >= 3.5) {
    overall = { level: "Sangat Baik", detail: "Koneksi prima untuk segala aktivitas digital", status: "great" };
  } else if (avg >= 2.5) {
    overall = { level: "Baik", detail: "Koneksi stabil dan memadai untuk aktivitas harian", status: "good" };
  } else if (avg >= 1.75) {
    overall = { level: "Cukup", detail: "Cukup untuk kebutuhan browsing dan media standar", status: "average" };
  } else {
    overall = { level: "Kurang", detail: "Koneksi terbatas atau latensi tinggi", status: "poor" };
  }

  return {
    streaming,
    gaming,
    videoCall,
    browsing,
    overall,
  };
}
