export type SpeedTestPhase =
  | "idle"
  | "discovering"
  | "download"
  | "upload"
  | "finalizing"
  | "completed"
  | "cancelled"
  | "error";

export interface SpeedTestResult {
  downloadMbps: number | null;
  uploadMbps: number | null;
  pingMs: number | null;
  jitterMs: number | null;
}

export interface DiscoveredServerInfo {
  machine?: string;
  city?: string;
  country?: string;
  metro?: string;
  hostname?: string;
}

export interface LatencySample {
  rttMs: number;
  timestamp: number;
}

export interface SpeedTestProgress {
  phase: SpeedTestPhase;
  currentSpeedMbps: number;
  results: SpeedTestResult;
  serverInfo: DiscoveredServerInfo | null;
  errorMessage: string;
}

export interface Ndt7RunnerOptions {
  userAcceptedDataPolicy: boolean;
  onPhaseChange?: (phase: SpeedTestPhase) => void;
  onSpeedUpdate?: (speedMbps: number, phase: "download" | "upload") => void;
  onResultUpdate?: (partial: Partial<SpeedTestResult>) => void;
  onServerDiscovered?: (server: DiscoveredServerInfo) => void;
  onError?: (errorMessage: string) => void;
}
