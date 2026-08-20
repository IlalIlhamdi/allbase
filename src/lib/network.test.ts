import { describe, it, expect } from "vitest";
import {
  isValidIPv4,
  prefixToMask,
  maskToPrefix,
  isValidSubnetMask,
  calculateSubnet,
  analyzeIP,
  getIPClass,
  getIPScope,
  ipToBinary,
  ipToHex,
  convertMbpsToMBps,
  convertMBpsToMbps,
  convertNumberBases,
  convertDecimalToBinary,
  convertBinaryToDecimal,
  convertDecimalToHex,
  convertHexToDecimal,
} from "./network";

describe("Network IPv4 Utilities", () => {
  it("validates IPv4 addresses correctly", () => {
    expect(isValidIPv4("192.168.1.1")).toBe(true);
    expect(isValidIPv4("10.0.0.1")).toBe(true);
    expect(isValidIPv4("172.16.0.1")).toBe(true);
    expect(isValidIPv4("255.255.255.255")).toBe(true);
    expect(isValidIPv4("0.0.0.0")).toBe(true);

    expect(isValidIPv4("256.0.0.1")).toBe(false);
    expect(isValidIPv4("192.168.1")).toBe(false);
    expect(isValidIPv4("192.168.1.1.1")).toBe(false);
    expect(isValidIPv4("abc.def.ghi.jkl")).toBe(false);
    expect(isValidIPv4("192.168.-1.1")).toBe(false);
    expect(isValidIPv4("")).toBe(false);
  });

  it("converts CIDR prefix to subnet mask", () => {
    expect(prefixToMask(8)).toBe("255.0.0.0");
    expect(prefixToMask(16)).toBe("255.255.0.0");
    expect(prefixToMask(24)).toBe("255.255.255.0");
    expect(prefixToMask(25)).toBe("255.255.255.128");
    expect(prefixToMask(26)).toBe("255.255.255.192");
    expect(prefixToMask(27)).toBe("255.255.255.224");
    expect(prefixToMask(28)).toBe("255.255.255.240");
    expect(prefixToMask(29)).toBe("255.255.255.248");
    expect(prefixToMask(30)).toBe("255.255.255.252");
    expect(prefixToMask(31)).toBe("255.255.255.254");
    expect(prefixToMask(32)).toBe("255.255.255.255");
    expect(prefixToMask(0)).toBe("0.0.0.0");
  });

  it("converts subnet mask to CIDR prefix", () => {
    expect(maskToPrefix("255.255.255.0")).toBe(24);
    expect(maskToPrefix("255.0.0.0")).toBe(8);
    expect(maskToPrefix("255.255.0.0")).toBe(16);
    expect(maskToPrefix("255.255.255.252")).toBe(30);
    expect(maskToPrefix("255.255.255.254")).toBe(31);
    expect(maskToPrefix("255.255.255.255")).toBe(32);
    expect(maskToPrefix("0.0.0.0")).toBe(0);

    // Invalid / non-contiguous masks
    expect(maskToPrefix("255.255.0.255")).toBeNull();
    expect(maskToPrefix("255.255.255.1")).toBeNull();
    expect(maskToPrefix("invalid")).toBeNull();
  });

  it("validates subnet masks", () => {
    expect(isValidSubnetMask("255.255.255.0")).toBe(true);
    expect(isValidSubnetMask("255.255.255.128")).toBe(true);
    expect(isValidSubnetMask("255.255.255.1")).toBe(false);
  });

  it("calculates subnet for standard test cases", () => {
    // Test Case 1: 192.168.1.10/24
    const res1 = calculateSubnet("192.168.1.10", 24);
    expect(res1).not.toBeNull();
    expect(res1?.network).toBe("192.168.1.0");
    expect(res1?.broadcast).toBe("192.168.1.255");
    expect(res1?.mask).toBe("255.255.255.0");
    expect(res1?.wildcard).toBe("0.0.0.255");
    expect(res1?.totalAddresses).toBe(256);
    expect(res1?.usableHosts).toBe(254);
    expect(res1?.firstHost).toBe("192.168.1.1");
    expect(res1?.lastHost).toBe("192.168.1.254");
    expect(res1?.ipClass).toBe("Kelas C");
    expect(res1?.ipScope).toBe("Private (RFC 1918)");

    // Test Case 2: 10.0.0.1/8
    const res2 = calculateSubnet("10.0.0.1", 8);
    expect(res2?.network).toBe("10.0.0.0");
    expect(res2?.broadcast).toBe("10.255.255.255");
    expect(res2?.usableHosts).toBe(16777214);
    expect(res2?.firstHost).toBe("10.0.0.1");
    expect(res2?.lastHost).toBe("10.255.255.254");
    expect(res2?.ipClass).toBe("Kelas A");
    expect(res2?.ipScope).toBe("Private (RFC 1918)");

    // Test Case 3: 172.16.20.20/16
    const res3 = calculateSubnet("172.16.20.20", 16);
    expect(res3?.network).toBe("172.16.0.0");
    expect(res3?.broadcast).toBe("172.16.255.255");
    expect(res3?.usableHosts).toBe(65534);
    expect(res3?.firstHost).toBe("172.16.0.1");
    expect(res3?.lastHost).toBe("172.16.255.254");
    expect(res3?.ipClass).toBe("Kelas B");

    // Test Case 4: 192.168.10.130/26
    const res4 = calculateSubnet("192.168.10.130", 26);
    expect(res4?.network).toBe("192.168.10.128");
    expect(res4?.broadcast).toBe("192.168.10.191");
    expect(res4?.usableHosts).toBe(62);
    expect(res4?.firstHost).toBe("192.168.10.129");
    expect(res4?.lastHost).toBe("192.168.10.190");
  });

  it("handles boundary subnets /30, /31, and /32", () => {
    // /30: 2 usable hosts
    const res30 = calculateSubnet("192.168.1.5", 30);
    expect(res30?.network).toBe("192.168.1.4");
    expect(res30?.broadcast).toBe("192.168.1.7");
    expect(res30?.firstHost).toBe("192.168.1.5");
    expect(res30?.lastHost).toBe("192.168.1.6");
    expect(res30?.usableHosts).toBe(2);

    // /31: RFC 3021 (2 usable hosts)
    const res31 = calculateSubnet("192.168.1.0", 31);
    expect(res31?.network).toBe("192.168.1.0");
    expect(res31?.broadcast).toBe("192.168.1.1");
    expect(res31?.firstHost).toBe("192.168.1.0");
    expect(res31?.lastHost).toBe("192.168.1.1");
    expect(res31?.usableHosts).toBe(2);

    // /32: Single Host (1 usable host)
    const res32 = calculateSubnet("192.168.1.1", 32);
    expect(res32?.network).toBe("192.168.1.1");
    expect(res32?.broadcast).toBe("192.168.1.1");
    expect(res32?.firstHost).toBe("192.168.1.1");
    expect(res32?.lastHost).toBe("192.168.1.1");
    expect(res32?.usableHosts).toBe(1);
  });

  it("identifies IP class and scope correctly", () => {
    expect(getIPClass(10)).toBe("Kelas A");
    expect(getIPClass(172)).toBe("Kelas B");
    expect(getIPClass(192)).toBe("Kelas C");
    expect(getIPClass(224)).toBe("Kelas D (Multicast)");
    expect(getIPClass(240)).toBe("Kelas E (Experimental/Reserved)");
    expect(getIPClass(127)).toBe("Loopback");

    expect(getIPScope("192.168.1.1")).toBe("Private (RFC 1918)");
    expect(getIPScope("10.50.1.1")).toBe("Private (RFC 1918)");
    expect(getIPScope("172.20.0.1")).toBe("Private (RFC 1918)");
    expect(getIPScope("127.0.0.1")).toBe("Loopback (RFC 1122)");
    expect(getIPScope("169.254.10.5")).toBe("Link-Local / APIPA (RFC 3927)");
    expect(getIPScope("8.8.8.8")).toBe("Public (Internet Routable)");
    expect(getIPScope("1.1.1.1")).toBe("Public (Internet Routable)");
  });

  it("converts IPv4 to binary and hex", () => {
    expect(ipToBinary("192.168.1.1")).toBe("11000000.10101000.00000001.00000001");
    expect(ipToHex("192.168.1.1")).toBe("C0.A8.01.01");

    const analysis = analyzeIP("192.168.1.1", 24);
    expect(analysis?.binaryMask).toBe("11111111.11111111.11111111.00000000");
    expect(analysis?.binaryNetwork).toBe("11000000.10101000.00000001.00000000");
  });
});

describe("Network Speed & Number Base Conversions", () => {
  it("converts Mbps to MB/s and vice versa", () => {
    expect(convertMbpsToMBps(100)).toBe(12.5);
    expect(convertMbpsToMBps(1000)).toBe(125);
    expect(convertMBpsToMbps(12.5)).toBe(100);
    expect(convertMBpsToMbps(125)).toBe(1000);
  });

  it("converts decimal, binary, and hex numbers", () => {
    const bases = convertNumberBases(192);
    expect(bases.binary).toBe("11000000");
    expect(bases.hex).toBe("C0");

    expect(convertDecimalToBinary("192").value).toBe("11000000");
    expect(convertBinaryToDecimal("11000000").value).toBe("192");
    expect(convertDecimalToHex("192").value).toBe("C0");
    expect(convertHexToDecimal("C0").value).toBe("192");

    // Invalid checks
    expect(convertBinaryToDecimal("1102").error).toBeDefined();
    expect(convertHexToDecimal("ZZZ").error).toBeDefined();
    expect(convertDecimalToBinary("-5").error).toBeDefined();
  });
});
