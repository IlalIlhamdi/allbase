import { describe, it, expect } from "vitest";
import {
  calculateMbps,
  calculateRttMs,
  calculateJitterMs,
  formatSpeed,
  formatLatency,
} from "./calculations";

describe("calculateMbps", () => {
  it("calculates correct Mbps from bytes and seconds", () => {
    // 12.5 MB in 1 second = 100 Mbps
    const bytes = 12_500_000;
    const seconds = 1;
    expect(calculateMbps(bytes, seconds)).toBe(100);
  });

  it("handles non-integer values accurately", () => {
    // 2.5 MB in 0.5s = 40 Mbps
    expect(calculateMbps(2_500_000, 0.5)).toBe(40);
  });

  it("returns null for invalid inputs or negative numbers", () => {
    expect(calculateMbps(0, 0)).toBeNull();
    expect(calculateMbps(-100, 1)).toBeNull();
    expect(calculateMbps(100, -1)).toBeNull();
    expect(calculateMbps(NaN, 1)).toBeNull();
    expect(calculateMbps(100, Infinity)).toBeNull();
  });
});

describe("calculateRttMs", () => {
  it("converts microseconds to milliseconds correctly", () => {
    expect(calculateRttMs(18500)).toBe(18.5);
    expect(calculateRttMs(3200)).toBe(3.2);
    expect(calculateRttMs(100000)).toBe(100);
  });

  it("returns null for undefined, null, or invalid numbers", () => {
    expect(calculateRttMs(undefined)).toBeNull();
    expect(calculateRttMs(null)).toBeNull();
    expect(calculateRttMs(-500)).toBeNull();
    expect(calculateRttMs(0)).toBeNull();
    expect(calculateRttMs(NaN)).toBeNull();
  });
});

describe("calculateJitterMs", () => {
  it("calculates RFC 3550 average consecutive delta", () => {
    // Delts: |20-18|=2, |19-20|=1, |25-19|=6, |22-25|=3 -> sum = 12 / 4 = 3.0 ms
    const samples = [18, 20, 19, 25, 22];
    expect(calculateJitterMs(samples)).toBe(3.0);
  });

  it("returns 0 for perfectly consistent samples", () => {
    expect(calculateJitterMs([20, 20, 20, 20])).toBe(0);
  });

  it("returns null for less than 2 samples", () => {
    expect(calculateJitterMs([])).toBeNull();
    expect(calculateJitterMs([15])).toBeNull();
  });
});

describe("formatSpeed and formatLatency", () => {
  it("formats speed values according to thresholds", () => {
    expect(formatSpeed(null)).toBe("—");
    expect(formatSpeed(undefined)).toBe("—");
    expect(formatSpeed(87.423)).toBe("87.42");
    expect(formatSpeed(125.67)).toBe("125.7");
    expect(formatSpeed(1024.8)).toBe("1025");
  });

  it("formats latency values according to thresholds", () => {
    expect(formatLatency(null)).toBe("—");
    expect(formatLatency(undefined)).toBe("—");
    expect(formatLatency(4.24)).toBe("4.2");
    expect(formatLatency(18.7)).toBe("19");
  });
});
