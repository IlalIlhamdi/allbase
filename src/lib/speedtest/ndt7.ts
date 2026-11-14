import ndt7, {
  NDT7Config,
  NDT7ServerChoice,
  NDT7MeasurementEvent,
  NDT7CompleteEvent,
} from "@m-lab/ndt7";
import {
  SpeedTestPhase,
  SpeedTestResult,
  DiscoveredServerInfo,
  Ndt7RunnerOptions,
} from "./types";
import {
  calculateMbps,
  calculateRttMs,
  calculateJitterMs,
} from "./calculations";

const MAX_LATENCY_SAMPLES = 100;

export interface Ndt7RunController {
  cancel: () => void;
  runId: number;
}

/**
 * Human-friendly error translation for NDT7 and network failure scenarios.
 */
export function formatNdt7ErrorMessage(rawError: unknown): string {
  if (typeof window !== "undefined" && !navigator.onLine) {
    return "Perangkat sedang offline. Hubungkan ke internet lalu coba lagi.";
  }

  const errStr =
    rawError instanceof Error
      ? rawError.message
      : typeof rawError === "string"
      ? rawError
      : "";

  const lower = errStr.toLowerCase();

  if (lower.includes("locate") || lower.includes("serverdiscovery") || lower.includes("could not understand response")) {
    return "Server pengujian tidak dapat ditemukan. Periksa koneksi internet lalu coba lagi.";
  }

  if (lower.includes("websocket") || lower.includes("connection") || lower.includes("failed") || lower.includes("error")) {
    return "Koneksi ke server pengujian M-Lab terputus. Coba kembali beberapa saat lagi.";
  }

  if (lower.includes("timeout") || lower.includes("timed out")) {
    return "Pengujian membutuhkan waktu terlalu lama. Silakan coba kembali.";
  }

  if (lower.includes("policy") || lower.includes("consent")) {
    return "Persetujuan kebijakan data M-Lab diperlukan untuk menjalankan pengujian.";
  }

  return "Pengujian belum dapat diselesaikan. Silakan coba lagi.";
}

function trackWorkersDuring(
  activeWorkers: Set<Worker>,
  runner: () => Promise<number>
): Promise<number> {
  if (typeof window === "undefined" || typeof window.Worker !== "function") {
    return runner();
  }

  const OriginalWorker = window.Worker;
  const TrackedWorker = function (
    scriptURL: string | URL,
    options?: WorkerOptions
  ): Worker {
    const instance = new OriginalWorker(scriptURL, options);
    activeWorkers.add(instance);
    return instance;
  } as unknown as typeof Worker;

  TrackedWorker.prototype = OriginalWorker.prototype;
  window.Worker = TrackedWorker;

  try {
    return runner();
  } finally {
    window.Worker = OriginalWorker;
  }
}

/**
 * Executes a client-side M-Lab NDT7 measurement suite.
 *
 * Runs:
 * 1. Server Discovery via M-Lab Locate Service
 * 2. Download Test via Web Worker WebSocket
 * 3. Upload Test via Web Worker WebSocket
 * 4. Latency & Jitter calculation from TCPInfo & RTT samples
 */
export function runNdt7SpeedTest(
  options: Ndt7RunnerOptions,
  onFinished: (result: SpeedTestResult, phase: SpeedTestPhase) => void
): Ndt7RunController {
  const runId = Date.now();
  let isCancelled = false;
  let isFinished = false;
  const activeWorkers = new Set<Worker>();

  const terminateActiveWorkers = () => {
    activeWorkers.forEach((worker) => {
      try {
        worker.terminate();
      } catch {
        // Ignore worker termination errors
      }
    });
    activeWorkers.clear();
  };

  const finishRun = (finalPhase: SpeedTestPhase) => {
    if (isFinished) return;
    isFinished = true;
    terminateActiveWorkers();
    options.onPhaseChange?.(finalPhase);
    onFinished(accumulatedResult, finalPhase);
  };

  const latencySamples: number[] = [];
  const accumulatedResult: SpeedTestResult = {
    downloadMbps: null,
    uploadMbps: null,
    pingMs: null,
    jitterMs: null,
  };

  // Pre-flight offline check
  if (typeof window !== "undefined" && !navigator.onLine) {
    options.onError?.("Perangkat sedang offline. Hubungkan ke internet lalu coba lagi.");
    onFinished(accumulatedResult, "error");
    return {
      runId,
      cancel: () => {},
    };
  }

  if (!options.userAcceptedDataPolicy) {
    options.onError?.("Persetujuan kebijakan data M-Lab diperlukan untuk memulai tes.");
    onFinished(accumulatedResult, "error");
    return {
      runId,
      cancel: () => {},
    };
  }

  options.onPhaseChange?.("discovering");

  const config: NDT7Config = {
    userAcceptedDataPolicy: true,
    protocol: "wss",
    metadata: {
      client_name: "allbase-speed-test",
      client_version: "1.0.0",
    },
    // Explicit worker paths in public directory to avoid 404 on Next.js subroutes
    downloadworkerfile: "/ndt7/ndt7-download-worker.js",
    uploadworkerfile: "/ndt7/ndt7-upload-worker.js",
  };

  const handleLatency = (rttMicroseconds: number | undefined) => {
    const rttMs = calculateRttMs(rttMicroseconds);
    if (rttMs !== null) {
      if (latencySamples.length < MAX_LATENCY_SAMPLES) {
        latencySamples.push(rttMs);
      }
      accumulatedResult.pingMs = rttMs;

      const jitter = calculateJitterMs(latencySamples);
      if (jitter !== null) {
        accumulatedResult.jitterMs = jitter;
      }

      options.onResultUpdate?.({
        pingMs: accumulatedResult.pingMs,
        jitterMs: accumulatedResult.jitterMs,
      });
    }
  };

  const callbacks = {
    error: (err: string | Error) => {
      if (isCancelled || isFinished) return;
      const userMsg = formatNdt7ErrorMessage(err);
      options.onError?.(userMsg);
      finishRun("error");
    },

    serverDiscovery: () => {
      if (isCancelled || isFinished) return;
      options.onPhaseChange?.("discovering");
    },

    serverChosen: (server: NDT7ServerChoice) => {
      if (isCancelled || isFinished) return;
      const info: DiscoveredServerInfo = {
        machine: server.machine,
        city: server.location?.city,
        country: server.location?.country,
        metro: server.location?.metro,
        hostname: typeof server.machine === "string" ? server.machine : undefined,
      };
      options.onServerDiscovered?.(info);
    },

    downloadStart: () => {
      if (isCancelled || isFinished) return;
      options.onPhaseChange?.("download");
    },

    downloadMeasurement: (event: NDT7MeasurementEvent) => {
      if (isCancelled || isFinished) return;

      if (event.Source === "client") {
        const data = event.Data;
        const mbps =
          data.MeanClientMbps ??
          calculateMbps(data.NumBytes, data.ElapsedTime);

        if (mbps !== null && Number.isFinite(mbps) && mbps >= 0) {
          accumulatedResult.downloadMbps = mbps;
          options.onSpeedUpdate?.(mbps, "download");
          options.onResultUpdate?.({ downloadMbps: mbps });
        }
      } else if (event.Source === "server") {
        const serverData = event.Data;
        // Prefer TCPInfo RTT (in microseconds)
        if (serverData.TCPInfo?.RTT) {
          handleLatency(serverData.TCPInfo.RTT);
        } else if (serverData.BBRInfo?.MinRTT) {
          handleLatency(serverData.BBRInfo.MinRTT);
        }
      }
    },

    downloadComplete: (event: NDT7CompleteEvent) => {
      if (isCancelled || isFinished) return;

      // Record final download client measurement if available
      if (event.LastClientMeasurement) {
        const data = event.LastClientMeasurement;
        const mbps =
          data.MeanClientMbps ??
          calculateMbps(data.NumBytes, data.ElapsedTime);
        if (mbps !== null && Number.isFinite(mbps) && mbps >= 0) {
          accumulatedResult.downloadMbps = mbps;
        }
      }

      if (event.LastServerMeasurement?.TCPInfo?.RTT) {
        handleLatency(event.LastServerMeasurement.TCPInfo.RTT);
      }

      options.onResultUpdate?.({ downloadMbps: accumulatedResult.downloadMbps });
    },

    uploadStart: () => {
      if (isCancelled || isFinished) return;
      options.onPhaseChange?.("upload");
    },

    uploadMeasurement: (event: NDT7MeasurementEvent) => {
      if (isCancelled || isFinished) return;

      if (event.Source === "client") {
        const data = event.Data;
        const mbps =
          data.MeanClientMbps ??
          calculateMbps(data.NumBytes, data.ElapsedTime);

        if (mbps !== null && Number.isFinite(mbps) && mbps >= 0) {
          accumulatedResult.uploadMbps = mbps;
          options.onSpeedUpdate?.(mbps, "upload");
          options.onResultUpdate?.({ uploadMbps: mbps });
        }
      } else if (event.Source === "server") {
        const serverData = event.Data;
        if (serverData.TCPInfo?.RTT) {
          handleLatency(serverData.TCPInfo.RTT);
        }
      }
    },

    uploadComplete: (event: NDT7CompleteEvent) => {
      if (isCancelled || isFinished) return;

      if (event.LastClientMeasurement) {
        const data = event.LastClientMeasurement;
        const mbps =
          data.MeanClientMbps ??
          calculateMbps(data.NumBytes, data.ElapsedTime);
        if (mbps !== null && Number.isFinite(mbps) && mbps >= 0) {
          accumulatedResult.uploadMbps = mbps;
        }
      }

      if (event.LastServerMeasurement?.TCPInfo?.RTT) {
        handleLatency(event.LastServerMeasurement.TCPInfo.RTT);
      }

      options.onPhaseChange?.("finalizing");
      options.onResultUpdate?.({ uploadMbps: accumulatedResult.uploadMbps });

      // Test fully completed
      setTimeout(() => {
        if (isCancelled || isFinished) return;
        finishRun("completed");
      }, 300);
    },
  };

  const execute = async () => {
    try {
      const urlPromise = ndt7.discoverServerURLs(config, callbacks);
      const downloadCode = await trackWorkersDuring(activeWorkers, () =>
        ndt7.downloadTest(config, callbacks, urlPromise)
      );

      if (isCancelled || isFinished || downloadCode !== 0) {
        if (!isCancelled && !isFinished && downloadCode !== 0) {
          options.onError?.("Pengujian download gagal diselesaikan.");
          finishRun("error");
        }
        return;
      }

      const uploadCode = await trackWorkersDuring(activeWorkers, () =>
        ndt7.uploadTest(config, callbacks, urlPromise)
      );

      if (!isCancelled && !isFinished && uploadCode !== 0) {
        options.onError?.("Pengujian upload gagal diselesaikan.");
        finishRun("error");
      }
    } catch (err) {
      if (isCancelled || isFinished) return;
      const userMsg = formatNdt7ErrorMessage(err);
      options.onError?.(userMsg);
      finishRun("error");
    }
  };

  // Launch async runner
  execute();

  return {
    runId,
    cancel: () => {
      if (isCancelled || isFinished) return;
      isCancelled = true;
      finishRun("cancelled");
    },
  };
}
