import { describe, it, expect } from "vitest";
import { evaluateConnectionQuality, speedToFraction } from "./speedTestQuality";

describe("speedToFraction dynamic scale mapping", () => {
  it("returns 0 for 0 or negative speeds", () => {
    expect(speedToFraction(0)).toBe(0);
    expect(speedToFraction(-10)).toBe(0);
  });

  it("smoothly maps low, medium, high and gigabit speeds", () => {
    // 0-10 Mbps (0 -> 0.25)
    expect(speedToFraction(5)).toBeCloseTo(0.125, 3);
    expect(speedToFraction(10)).toBeCloseTo(0.25, 3);

    // 10-50 Mbps (0.25 -> 0.50)
    expect(speedToFraction(30)).toBeCloseTo(0.375, 3);
    expect(speedToFraction(50)).toBeCloseTo(0.50, 3);

    // 50-100 Mbps (0.50 -> 0.70)
    expect(speedToFraction(75)).toBeCloseTo(0.60, 3);
    expect(speedToFraction(100)).toBeCloseTo(0.70, 3);

    // 100-250 Mbps (0.70 -> 0.85)
    expect(speedToFraction(175)).toBeCloseTo(0.775, 3);
    expect(speedToFraction(250)).toBeCloseTo(0.85, 3);

    // 250-500 Mbps (0.85 -> 0.95)
    expect(speedToFraction(500)).toBeCloseTo(0.95, 3);

    // 1000+ Mbps (capped at 1.0)
    expect(speedToFraction(1000)).toBeCloseTo(1.0, 3);
    expect(speedToFraction(2000)).toBe(1);
  });

  it("maintains strict monotonic increase", () => {
    const speeds = [0, 1, 5, 10, 25, 50, 75, 100, 150, 250, 400, 500, 800, 1000, 1500];
    for (let i = 0; i < speeds.length - 1; i++) {
      const current = speeds[i]!;
      const next = speeds[i + 1]!;
      expect(speedToFraction(next)).toBeGreaterThanOrEqual(speedToFraction(current));
    }
  });
});

describe("evaluateConnectionQuality", () => {
  it("returns null when all inputs are null", () => {
    expect(
      evaluateConnectionQuality({
        download: null,
        upload: null,
        ping: null,
        jitter: null,
      })
    ).toBeNull();
  });

  it("correctly evaluates excellent / gigabit fiber connection", () => {
    const result = evaluateConnectionQuality({
      download: 150.5,
      upload: 50.2,
      ping: 12.0,
      jitter: 2.0,
    });

    expect(result).not.toBeNull();
    expect(result?.streaming.level).toBe("Sangat Baik");
    expect(result?.gaming.level).toBe("Sangat Baik");
    expect(result?.videoCall.level).toBe("Sangat Baik");
    expect(result?.browsing.level).toBe("Sangat Baik");
    expect(result?.overall.level).toBe("Sangat Baik");
  });

  it("correctly evaluates good medium broadband connection", () => {
    const result = evaluateConnectionQuality({
      download: 18.0,
      upload: 4.5,
      ping: 45.0,
      jitter: 10.0,
    });

    expect(result).not.toBeNull();
    expect(result?.streaming.level).toBe("Baik");
    expect(result?.gaming.level).toBe("Baik");
    expect(result?.videoCall.level).toBe("Baik");
    expect(result?.browsing.level).toBe("Sangat Baik");
  });

  it("correctly evaluates poor/high latency connection", () => {
    const result = evaluateConnectionQuality({
      download: 2.0,
      upload: 0.3,
      ping: 150.0,
      jitter: 45.0,
    });

    expect(result).not.toBeNull();
    expect(result?.streaming.level).toBe("Kurang");
    expect(result?.gaming.level).toBe("Kurang");
    expect(result?.videoCall.level).toBe("Kurang");
    expect(result?.overall.level).toBe("Kurang");
  });
});
