export interface SubnetResult {
  ip: string;
  prefix: number;
  mask: string;
  network: string;
  broadcast: string;
  wildcard: string;
  firstHost: string;
  lastHost: string;
  totalAddresses: number;
  usableHosts: number;
  ipClass: string;
  ipType: string;
  ipBinary: string;
  maskBinary: string;
  wildcardBinary: string;
  networkBinary: string;
  broadcastBinary: string;
  borrowedBits: number;
  subnetsCount: number;
  specialNote?: string;
}

export function isValidIPv4(ip: string): boolean {
  if (typeof ip !== "string") return false;
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    if (!/^\d+$/.test(p)) return false;
    const num = parseInt(p, 10);
    return num >= 0 && num <= 255 && (p === "0" || !p.startsWith("0") || p.length === 1);
  });
}

export function prefixToMask(prefix: number): string {
  const p = Math.floor(prefix);
  if (isNaN(p) || p < 0 || p > 32) return "255.255.255.0";
  if (p === 0) return "0.0.0.0";
  const maskBits = (0xffffffff << (32 - p)) >>> 0;
  return [
    (maskBits >>> 24) & 255,
    (maskBits >>> 16) & 255,
    (maskBits >>> 8) & 255,
    maskBits & 255,
  ].join(".");
}

export function maskToPrefix(mask: string): number | null {
  if (!isValidIPv4(mask)) return null;
  const parts = mask.trim().split(".").map((n) => parseInt(n, 10));
  const maskNum = parts.reduce((acc, oct) => ((acc << 8) + oct) >>> 0, 0);

  // Check if mask has contiguous 1s followed by 0s
  const inverted = (~maskNum) >>> 0;
  const plusOne = (inverted + 1) >>> 0;
  // If (plusOne & inverted) === 0 and plusOne is a power of 2
  if ((plusOne & (plusOne - 1)) !== 0 && maskNum !== 0xffffffff && maskNum !== 0) {
    return null;
  }

  // Count leading 1s
  let count = 0;
  for (let i = 31; i >= 0; i--) {
    if ((maskNum & (1 << i)) !== 0) {
      count++;
    } else {
      break;
    }
  }

  // Verify remainder is all 0
  const expectedMask = count === 0 ? 0 : ((0xffffffff << (32 - count)) >>> 0);
  if (maskNum !== expectedMask) return null;

  return count;
}

export function getIPClass(firstOctet: number): string {
  if (firstOctet >= 1 && firstOctet <= 126) return "Kelas A";
  if (firstOctet === 127) return "Loopback";
  if (firstOctet >= 128 && firstOctet <= 191) return "Kelas B";
  if (firstOctet >= 192 && firstOctet <= 223) return "Kelas C";
  if (firstOctet >= 224 && firstOctet <= 239) return "Kelas D (Multicast)";
  if (firstOctet >= 240 && firstOctet <= 255) return "Kelas E (Experimental)";
  return "Khusus / Default (0.0.0.0)";
}

export function getIPType(ip: string): string {
  if (!isValidIPv4(ip)) return "Tidak Valid";
  const parts = ip.split(".").map(Number);
  const a = parts[0] ?? 0;
  const b = parts[1] ?? 0;
  const c = parts[2] ?? 0;

  if (a === 10) return "Privat (RFC 1918 - Kelas A)";
  if (a === 172 && b >= 16 && b <= 31) return "Privat (RFC 1918 - Kelas B)";
  if (a === 192 && b === 168) return "Privat (RFC 1918 - Kelas C)";
  if (a === 127) return "Loopback (Host Lokal)";
  if (a === 169 && b === 254) return "Link-Local / APIPA (RFC 3927)";
  if (a === 0) return "Default Route (0.0.0.0/8)";
  if (a >= 224 && a <= 239) return "Multicast (RFC 5771)";
  if (a >= 240) return "Experimental / Dicadangkan (RFC 1112)";
  if (a === 192 && b === 0 && c === 2) return "TEST-NET-1 (Dokumentasi)";
  if (a === 198 && b === 51 && c === 100) return "TEST-NET-2 (Dokumentasi)";
  if (a === 203 && b === 0 && c === 113) return "TEST-NET-3 (Dokumentasi)";

  return "Publik (Global Internet)";
}

export function ipToBinaryString(ip: string): string {
  if (!isValidIPv4(ip)) return "00000000.00000000.00000000.00000000";
  return ip
    .split(".")
    .map((octet) => parseInt(octet, 10).toString(2).padStart(8, "0"))
    .join(".");
}

export function binaryStringToIp(binStr: string): string | null {
  const clean = binStr.replace(/[^01.]/g, "");
  const parts = clean.includes(".") ? clean.split(".") : clean.match(/.{1,8}/g) || [];
  if (parts.length !== 4) return null;
  if (!parts.every((p) => p.length === 8 && /^[01]{8}$/.test(p))) return null;
  return parts.map((p) => parseInt(p, 2)).join(".");
}

export function calculateSubnet(ip: string, prefix: number): SubnetResult | null {
  if (!isValidIPv4(ip)) return null;
  const cleanPrefix = Math.min(Math.max(0, Math.floor(prefix)), 32);

  const parts = ip.trim().split(".").map((n) => parseInt(n, 10));
  const firstOctet = parts[0] ?? 0;
  const ipNum = parts.reduce((acc, oct) => ((acc << 8) + oct) >>> 0, 0);
  const maskNum = cleanPrefix === 0 ? 0 : ((0xffffffff << (32 - cleanPrefix)) >>> 0);
  const netNum = (ipNum & maskNum) >>> 0;
  const broadcastNum = (netNum | (~maskNum >>> 0)) >>> 0;

  const network = [
    (netNum >>> 24) & 255,
    (netNum >>> 16) & 255,
    (netNum >>> 8) & 255,
    netNum & 255,
  ].join(".");

  const broadcast = [
    (broadcastNum >>> 24) & 255,
    (broadcastNum >>> 16) & 255,
    (broadcastNum >>> 8) & 255,
    broadcastNum & 255,
  ].join(".");

  const mask = prefixToMask(cleanPrefix);
  const wildcard = [
    (~maskNum >>> 24) & 255,
    (~maskNum >>> 16) & 255,
    (~maskNum >>> 8) & 255,
    ~maskNum & 255,
  ].join(".");

  const totalAddresses = cleanPrefix === 0 ? 4294967296 : Math.pow(2, 32 - cleanPrefix);
  let usableHosts = 0;
  let firstHost = "-";
  let lastHost = "-";
  let specialNote: string | undefined = undefined;

  if (cleanPrefix <= 30) {
    usableHosts = cleanPrefix === 0 ? 4294967294 : totalAddresses - 2;
    const firstNum = (netNum + 1) >>> 0;
    const lastNum = (broadcastNum - 1) >>> 0;
    firstHost = [
      (firstNum >>> 24) & 255,
      (firstNum >>> 16) & 255,
      (firstNum >>> 8) & 255,
      firstNum & 255,
    ].join(".");
    lastHost = [
      (lastNum >>> 24) & 255,
      (lastNum >>> 16) & 255,
      (lastNum >>> 8) & 255,
      lastNum & 255,
    ].join(".");
  } else if (cleanPrefix === 31) {
    // RFC 3021: Using 31-Bit Prefixes on IPv4 Point-to-Point Links
    usableHosts = 2;
    firstHost = network;
    lastHost = broadcast;
    specialNote = "RFC 3021: Subnet /31 dikhususkan untuk link Point-to-Point (keduanya merupakan alamat host yang dapat digunakan).";
  } else if (cleanPrefix === 32) {
    // Single Host Route
    usableHosts = 1;
    firstHost = ip.trim();
    lastHost = ip.trim();
    specialNote = "Subnet /32 mewakili single host route (hanya 1 alamat host mandiri tanpa network/broadcast terpisah).";
  }

  // Classful Base calculations
  let defaultClassPrefix = 24;
  if (firstOctet >= 1 && firstOctet <= 126) defaultClassPrefix = 8;
  else if (firstOctet >= 128 && firstOctet <= 191) defaultClassPrefix = 16;
  else if (firstOctet >= 192 && firstOctet <= 223) defaultClassPrefix = 24;

  const borrowedBits = cleanPrefix >= defaultClassPrefix ? cleanPrefix - defaultClassPrefix : 0;
  const subnetsCount = Math.pow(2, borrowedBits);

  return {
    ip: ip.trim(),
    prefix: cleanPrefix,
    mask,
    network,
    broadcast,
    wildcard,
    firstHost,
    lastHost,
    totalAddresses,
    usableHosts,
    ipClass: getIPClass(firstOctet),
    ipType: getIPType(ip.trim()),
    ipBinary: ipToBinaryString(ip.trim()),
    maskBinary: ipToBinaryString(mask),
    wildcardBinary: ipToBinaryString(wildcard),
    networkBinary: ipToBinaryString(network),
    broadcastBinary: ipToBinaryString(broadcast),
    borrowedBits,
    subnetsCount,
    specialNote,
  };
}

// ----------------------------------------------------
// Conversion Utilities
// ----------------------------------------------------

export function convertMbpsToMBps(mbps: number): number {
  if (isNaN(mbps) || mbps < 0) return 0;
  return Math.round((mbps / 8) * 10000) / 10000;
}

export function convertMBpsToMbps(mBps: number): number {
  if (isNaN(mBps) || mBps < 0) return 0;
  return Math.round(mBps * 8 * 10000) / 10000;
}

export function convertDecimalToBinary(val: number | string, pad = 8): string {
  const num = typeof val === "string" ? parseInt(val, 10) : val;
  if (isNaN(num) || num < 0) return "0".padStart(pad, "0");
  return Math.floor(num).toString(2).padStart(pad, "0");
}

export function convertBinaryToDecimal(binStr: string): number | null {
  const clean = binStr.replace(/\s+/g, "");
  if (!/^[01]+$/.test(clean)) return null;
  const num = parseInt(clean, 2);
  return isNaN(num) ? null : num;
}

export function convertNumberBases(val: number | string) {
  const num = typeof val === "string" ? parseInt(val, 10) : val;
  if (isNaN(num)) {
    return {
      decimal: 0,
      binary8: "00000000",
      binary16: "0000000000000000",
      binary32: "00000000000000000000000000000000",
      hex: "0",
      octal: "0",
    };
  }
  const cleanNum = Math.max(0, Math.floor(num));
  return {
    decimal: cleanNum,
    binary8: cleanNum.toString(2).padStart(8, "0"),
    binary16: cleanNum.toString(2).padStart(16, "0"),
    binary32: cleanNum.toString(2).padStart(32, "0"),
    hex: cleanNum.toString(16).toUpperCase(),
    octal: cleanNum.toString(8),
  };
}

export type BandwidthUnit =
  | "bps"
  | "Kbps"
  | "Mbps"
  | "Gbps"
  | "Tbps"
  | "B/s"
  | "KB/s"
  | "MB/s"
  | "GB/s"
  | "TB/s";

export function convertBandwidthUnits(
  value: number,
  fromUnit: BandwidthUnit,
  toUnit: BandwidthUnit,
  standard: "decimal" | "binary" = "decimal"
): number {
  if (isNaN(value) || value < 0) return 0;
  if (fromUnit === toUnit) return value;

  const k = standard === "binary" ? 1024 : 1000;

  // Convert everything to bits per second (bps) first
  const unitToBits: Record<BandwidthUnit, number> = {
    "bps": 1,
    "Kbps": k,
    "Mbps": Math.pow(k, 2),
    "Gbps": Math.pow(k, 3),
    "Tbps": Math.pow(k, 4),
    "B/s": 8,
    "KB/s": 8 * k,
    "MB/s": 8 * Math.pow(k, 2),
    "GB/s": 8 * Math.pow(k, 3),
    "TB/s": 8 * Math.pow(k, 4),
  };

  const bits = value * unitToBits[fromUnit];
  const result = bits / unitToBits[toUnit];

  return Math.round(result * 100000) / 100000;
}

export function convertAllBandwidthUnits(
  value: number,
  fromUnit: BandwidthUnit,
  standard: "decimal" | "binary" = "decimal"
): Record<BandwidthUnit, number> {
  const units: BandwidthUnit[] = ["bps", "Kbps", "Mbps", "Gbps", "Tbps", "B/s", "KB/s", "MB/s", "GB/s", "TB/s"];
  const res = {} as Record<BandwidthUnit, number>;
  for (const u of units) {
    res[u] = convertBandwidthUnits(value, fromUnit, u, standard);
  }
  return res;
}
