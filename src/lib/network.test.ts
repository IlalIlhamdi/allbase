import { describe, it, expect } from "vitest";
import {
  isValidIPv4,
  prefixToMask,
  calculateSubnet,
  convertMbpsToMBps,
  convertMBpsToMbps,
  convertNumberBases,
} from "./network";

describe("Network Utilities", () => {
  it("validates IPv4 addresses correctly", () => {
    expect(isValidIPv4("192.168.1.1")).toBe(true);
    expect(isValidIPv4("10.0.0.1")).toBe(true);
    expect(isValidIPv4("256.0.0.1")).toBe(false);
    expect(isValidIPv4("invalid-ip")).toBe(false);
  });

  it("converts CIDR prefix to subnet mask", () => {
    expect(prefixToMask(24)).toBe("255.255.255.0");
    expect(prefixToMask(30)).toBe("255.255.255.252");
    expect(prefixToMask(8)).toBe("255.0.0.0");
    expect(prefixToMask(0)).toBe("0.0.0.0");
  });

  it("calculates subnet details for /24 network", () => {
    const res = calculateSubnet("192.168.1.15", 24);
    expect(res).not.toBeNull();
    expect(res?.network).toBe("192.168.1.0");
    expect(res?.broadcast).toBe("192.168.1.255");
    expect(res?.firstHost).toBe("192.168.1.1");
    expect(res?.lastHost).toBe("192.168.1.254");
    expect(res?.usableHosts).toBe(254);
    expect(res?.ipClass).toBe("Kelas C");
  });

  it("handles boundary /31 and /32 subnets", () => {
    const res31 = calculateSubnet("192.168.1.1", 31);
    expect(res31?.usableHosts).toBe(2);

    const res32 = calculateSubnet("192.168.1.1", 32);
    expect(res32?.usableHosts).toBe(1);
  });

  it("converts Mbps to MB/s and vice versa", () => {
    expect(convertMbpsToMBps(100)).toBe(12.5);
    expect(convertMBpsToMbps(12.5)).toBe(100);
  });

  it("converts decimal to binary and hex", () => {
    const res = convertNumberBases(192);
    expect(res.binary).toBe("11000000");
    expect(res.hex).toBe("C0");
  });
});
