/**
 * Speed Test Calculation and Formatting Utilities
 *
 * Implements standard network measurement formulas:
 * - Throughput/Goodput calculation (Mbps) from application-level bytes & elapsed time.
 * - Latency (RTT) conversion from TCPInfo microseconds to milliseconds.
 * - Jitter calculation based on RFC 3550 Mean Absolute Successive Difference (MASD).
 */

/**
 * Calculates speed in Megabits per second (Mbps).
 * Formula: (bytes * 8 bits/byte) / (elapsedSeconds * 1,000,000 bits/Megabit)
 *
 * @param bytes - Total transferred bytes
 * @param elapsedSeconds - Elapsed time in seconds
 */
export function calculateMbps(bytes: number, elapsedSeconds: number): number | null {
  if (
    !Number.isFinite(bytes) ||
    !Number.isFinite(elapsedSeconds) ||
    bytes < 0 ||
    elapsedSeconds <= 0
  ) {
    return null;
  }

  const mbps = (bytes * 8) / (elapsedSeconds * 1_000_000);
  if (!Number.isFinite(mbps) || mbps < 0) {
    return null;
  }

  return mbps;
}

/**
 * Converts TCPInfo RTT from microseconds to milliseconds.
 *
 * @param rttMicroseconds - RTT value in microseconds from M-Lab server measurement
 */
export function calculateRttMs(rttMicroseconds: number | undefined | null): number | null {
  if (
    rttMicroseconds === undefined ||
    rttMicroseconds === null ||
    !Number.isFinite(rttMicroseconds) ||
    rttMicroseconds <= 0
  ) {
    return null;
  }

  const ms = rttMicroseconds / 1000;
  return Number.isFinite(ms) && ms >= 0 ? ms : null;
}

/**
 * Calculates statistical jitter (RFC 3550 mean absolute consecutive difference)
 * from an array of RTT latency samples (in milliseconds).
 *
 * @param rttSamples - Array of measured RTT values in ms
 */
export function calculateJitterMs(rttSamples: number[]): number | null {
  if (!Array.isArray(rttSamples) || rttSamples.length < 2) {
    return null;
  }

  const validSamples = rttSamples.filter((v) => Number.isFinite(v) && v >= 0);
  if (validSamples.length < 2) {
    return null;
  }

  let totalDiff = 0;
  for (let i = 1; i < validSamples.length; i++) {
    const prev = validSamples[i - 1];
    const curr = validSamples[i];
    if (prev !== undefined && curr !== undefined) {
      totalDiff += Math.abs(curr - prev);
    }
  }

  const jitter = totalDiff / (validSamples.length - 1);
  return Number.isFinite(jitter) && jitter >= 0 ? jitter : null;
}

/**
 * Formats speed in Mbps for clean, human-readable display.
 * - < 100 Mbps: 2 decimal places (e.g. "87.42")
 * - 100 - 999 Mbps: 1 decimal place (e.g. "124.5")
 * - >= 1000 Mbps: 0 decimal places (e.g. "1050")
 */
export function formatSpeed(mbps: number | null | undefined): string {
  if (mbps === null || mbps === undefined || !Number.isFinite(mbps) || mbps < 0) {
    return "—";
  }

  if (mbps < 100) {
    return mbps.toFixed(2);
  }
  if (mbps < 1000) {
    return mbps.toFixed(1);
  }
  return mbps.toFixed(0);
}

/**
 * Formats latency / jitter in ms for clean, human-readable display.
 */
export function formatLatency(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || !Number.isFinite(ms) || ms < 0) {
    return "—";
  }

  if (ms < 10) {
    return ms.toFixed(1);
  }
  return ms.toFixed(0);
}
