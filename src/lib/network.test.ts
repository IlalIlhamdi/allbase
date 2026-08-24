import { describe, it, expect } from "vitest";
import {
  isValidIPv4,
  prefixToMask,
  maskToPrefix,
  getIPClass,
  getIPType,
  calculateSubnet,
  convertMbpsToMBps,
  convertMBpsToMbps,
  convertDecimalToBinary,
  convertBinaryToDecimal,
  convertNumberBases,
  convertBandwidthUnits,
  ipToBinaryString,
  binaryStringToIp,
} from "./network";

describe("Network Utilities - IPv4 Validation", () => {
  it("validates valid IPv4 addresses correctly", () => {
    expect(isValidIPv4("192.168.1.1")).toBe(true);
    expect(isValidIPv4("10.0.0.1")).toBe(true);
    expect(isValidIPv4("172.16.254.1")).toBe(true);
    expect(isValidIPv4("0.0.0.0")).toBe(true);
    expect(isValidIPv4("255.255.255.255")).toBe(true);
  });

  it("rejects invalid IPv4 addresses", () => {
    expect(isValidIPv4("256.0.0.1")).toBe(false);
    expect(isValidIPv4("192.168.1")).toBe(false);
    expect(isValidIPv4("192.168.1.1.1")).toBe(false);
    expect(isValidIPv4("192.168.01.1")).toBe(false);
    expect(isValidIPv4("abc.def.ghi.jkl")).toBe(false);
    expect(isValidIPv4("")).toBe(false);
    expect(isValidIPv4("-1.0.0.1")).toBe(false);
  });
});

describe("Network Utilities - Subnet Mask & CIDR", () => {
  it("converts CIDR prefix to subnet mask accurately", () => {
    expect(prefixToMask(24)).toBe("255.255.255.0");
    expect(prefixToMask(30)).toBe("255.255.255.252");
    expect(prefixToMask(31)).toBe("255.255.255.254");
    expect(prefixToMask(32)).toBe("255.255.255.255");
    expect(prefixToMask(16)).toBe("255.255.0.0");
    expect(prefixToMask(8)).toBe("255.0.0.0");
    expect(prefixToMask(0)).toBe("0.0.0.0");
  });

  it("converts subnet mask to CIDR prefix", () => {
    expect(maskToPrefix("255.255.255.0")).toBe(24);
    expect(maskToPrefix("255.255.255.252")).toBe(30);
    expect(maskToPrefix("255.0.0.0")).toBe(8);
    expect(maskToPrefix("0.0.0.0")).toBe(0);
    expect(maskToPrefix("255.255.255.255")).toBe(32);
    expect(maskToPrefix("255.255.0.255")).toBeNull(); // Non-contiguous
    expect(maskToPrefix("invalid")).toBeNull();
  });
});

describe("Network Utilities - IP Class & Type", () => {
  it("identifies IP classes", () => {
    expect(getIPClass(10)).toBe("Kelas A");
    expect(getIPClass(127)).toBe("Loopback");
    expect(getIPClass(172)).toBe("Kelas B");
    expect(getIPClass(192)).toBe("Kelas C");
    expect(getIPClass(224)).toBe("Kelas D (Multicast)");
    expect(getIPClass(245)).toBe("Kelas E (Experimental)");
  });

  it("identifies IP type (private vs public vs loopback)", () => {
    expect(getIPType("10.10.10.10")).toContain("Privat");
    expect(getIPType("192.168.1.1")).toContain("Privat");
    expect(getIPType("172.20.0.1")).toContain("Privat");
    expect(getIPType("127.0.0.1")).toContain("Loopback");
    expect(getIPType("169.254.1.1")).toContain("Link-Local");
    expect(getIPType("8.8.8.8")).toContain("Publik");
  });
});

describe("Network Utilities - Subnet Calculation", () => {
  it("calculates subnet details for standard /24", () => {
    const res = calculateSubnet("192.168.1.15", 24);
    expect(res).not.toBeNull();
    expect(res?.network).toBe("192.168.1.0");
    expect(res?.broadcast).toBe("192.168.1.255");
    expect(res?.firstHost).toBe("192.168.1.1");
    expect(res?.lastHost).toBe("192.168.1.254");
    expect(res?.usableHosts).toBe(254);
    expect(res?.totalAddresses).toBe(256);
    expect(res?.wildcard).toBe("0.0.0.255");
    expect(res?.ipClass).toBe("Kelas C");
  });

  it("handles RFC 3021 /31 point-to-point subnets", () => {
    const res31 = calculateSubnet("10.0.0.0", 31);
    expect(res31?.usableHosts).toBe(2);
    expect(res31?.firstHost).toBe("10.0.0.0");
    expect(res31?.lastHost).toBe("10.0.0.1");
    expect(res31?.specialNote).toContain("RFC 3021");
  });

  it("handles /32 single host route", () => {
    const res32 = calculateSubnet("172.16.1.50", 32);
    expect(res32?.usableHosts).toBe(1);
    expect(res32?.firstHost).toBe("172.16.1.50");
    expect(res32?.lastHost).toBe("172.16.1.50");
    expect(res32?.specialNote).toContain("/32");
  });

  it("handles /0 default route without crash", () => {
    const res0 = calculateSubnet("0.0.0.0", 0);
    expect(res0?.totalAddresses).toBe(4294967296);
    expect(res0?.usableHosts).toBe(4294967294);
  });
});

describe("Network Utilities - Conversions & Binary", () => {
  it("converts IPv4 to binary string and back", () => {
    const bin = ipToBinaryString("192.168.1.1");
    expect(bin).toBe("11000000.10101000.00000001.00000001");
    expect(binaryStringToIp(bin)).toBe("192.168.1.1");
  });

  it("converts decimal to binary and binary to decimal", () => {
    expect(convertDecimalToBinary(255, 8)).toBe("11111111");
    expect(convertBinaryToDecimal("11111111")).toBe(255);
    expect(convertBinaryToDecimal("101010")).toBe(42);
    expect(convertBinaryToDecimal("invalid")).toBeNull();
  });

  it("converts Mbps to MB/s and vice versa", () => {
    expect(convertMbpsToMBps(100)).toBe(12.5);
    expect(convertMBpsToMbps(12.5)).toBe(100);
  });

  it("converts bandwidth across multiple units", () => {
    // 100 Mbps to MB/s (decimal standard)
    expect(convertBandwidthUnits(100, "Mbps", "MB/s", "decimal")).toBe(12.5);
    // 1 Gbps to Mbps
    expect(convertBandwidthUnits(1, "Gbps", "Mbps", "decimal")).toBe(1000);
    // 1000 KB/s to MB/s
    expect(convertBandwidthUnits(1000, "KB/s", "MB/s", "decimal")).toBe(1);
    // 8 Mbps to MB/s
    expect(convertBandwidthUnits(8, "Mbps", "MB/s", "decimal")).toBe(1);
  });

  it("converts number bases", () => {
    const res = convertNumberBases(192);
    expect(res.binary8).toBe("11000000");
    expect(res.hex).toBe("C0");
    expect(res.octal).toBe("300");
  });
});
