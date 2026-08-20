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
  ipScope: string;
  binaryIp: string;
  hexIp: string;
  integerIp: number;
}

export interface IPAnalysisResult extends SubnetResult {
  binaryMask: string;
  binaryNetwork: string;
  binaryBroadcast: string;
}

export function isValidIPv4(ip: string): boolean {
  if (typeof ip !== "string") return false;
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    if (!/^\d+$/.test(p)) return false;
    const num = parseInt(p, 10);
    return num >= 0 && num <= 255 && p === num.toString();
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
  const num = parts.reduce((acc, oct) => ((acc << 8) + oct) >>> 0, 0);

  // Convert to 32-bit binary string
  const binStr = (num >>> 0).toString(2).padStart(32, "0");

  // Valid subnet mask must be contiguous 1s followed by contiguous 0s
  const firstZero = binStr.indexOf("0");
  if (firstZero !== -1) {
    const remaining = binStr.slice(firstZero);
    if (remaining.includes("1")) return null; // Non-contiguous mask
    return firstZero;
  }
  return 32;
}

export function isValidSubnetMask(mask: string): boolean {
  return maskToPrefix(mask) !== null;
}

export function getIPClass(firstOctet: number): string {
  if (firstOctet >= 1 && firstOctet <= 126) return "Kelas A";
  if (firstOctet === 127) return "Loopback";
  if (firstOctet >= 128 && firstOctet <= 191) return "Kelas B";
  if (firstOctet >= 192 && firstOctet <= 223) return "Kelas C";
  if (firstOctet >= 224 && firstOctet <= 239) return "Kelas D (Multicast)";
  return "Kelas E (Experimental/Reserved)";
}

export function getIPScope(ip: string): string {
  if (!isValidIPv4(ip)) return "Invalid";
  const parts = ip.trim().split(".").map((n) => parseInt(n, 10));
  const o1 = parts[0] ?? 0;
  const o2 = parts[1] ?? 0;

  if (o1 === 10) return "Private (RFC 1918)";
  if (o1 === 172 && o2 >= 16 && o2 <= 31) return "Private (RFC 1918)";
  if (o1 === 192 && o2 === 168) return "Private (RFC 1918)";
  if (o1 === 127) return "Loopback (RFC 1122)";
  if (o1 === 169 && o2 === 254) return "Link-Local / APIPA (RFC 3927)";
  if (o1 === 100 && o2 >= 64 && o2 <= 127) return "Carrier-Grade NAT (RFC 6598)";
  if (o1 >= 224 && o1 <= 239) return "Multicast (RFC 5771)";
  if (o1 >= 240) return "Reserved / Experimental";
  if (o1 === 0) return "Default Network / Current";

  return "Public (Internet Routable)";
}

export function ipToBinary(ip: string): string {
  if (!isValidIPv4(ip)) return "00000000.00000000.00000000.00000000";
  return ip
    .trim()
    .split(".")
    .map((oct) => parseInt(oct, 10).toString(2).padStart(8, "0"))
    .join(".");
}

export function ipToHex(ip: string): string {
  if (!isValidIPv4(ip)) return "00.00.00.00";
  return ip
    .trim()
    .split(".")
    .map((oct) => parseInt(oct, 10).toString(16).toUpperCase().padStart(2, "0"))
    .join(".");
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

  const totalAddresses = Math.pow(2, 32 - cleanPrefix);
  let usableHosts = 0;
  let firstHost = "-";
  let lastHost = "-";

  if (cleanPrefix <= 30) {
    usableHosts = totalAddresses - 2;
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
    // RFC 3021: Point-to-point links
    usableHosts = 2;
    firstHost = network;
    lastHost = broadcast;
  } else if (cleanPrefix === 32) {
    // Single host route
    usableHosts = 1;
    firstHost = network;
    lastHost = network;
  }

  return {
    ip: parts.join("."),
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
    ipScope: getIPScope(ip),
    binaryIp: ipToBinary(ip),
    hexIp: ipToHex(ip),
    integerIp: ipNum,
  };
}

export function analyzeIP(ip: string, prefix: number): IPAnalysisResult | null {
  const subnet = calculateSubnet(ip, prefix);
  if (!subnet) return null;

  return {
    ...subnet,
    binaryMask: ipToBinary(subnet.mask),
    binaryNetwork: ipToBinary(subnet.network),
    binaryBroadcast: ipToBinary(subnet.broadcast),
  };
}

export function convertMbpsToMBps(mbps: number): number {
  if (isNaN(mbps) || mbps < 0) return 0;
  return Math.round((mbps / 8) * 10000) / 10000;
}

export function convertMBpsToMbps(mBps: number): number {
  if (isNaN(mBps) || mBps < 0) return 0;
  return Math.round(mBps * 8 * 10000) / 10000;
}

export function convertNumberBases(val: number | string) {
  const num = typeof val === "string" ? parseInt(val, 10) : val;
  if (isNaN(num) || num < 0) return { binary: "00000000", hex: "0" };
  const cleanNum = Math.floor(num);
  return {
    binary: cleanNum.toString(2).padStart(8, "0"),
    hex: cleanNum.toString(16).toUpperCase(),
  };
}

export function convertDecimalToBinary(decStr: string): { value: string; error?: string } {
  const clean = decStr.trim();
  if (!clean) return { value: "" };
  if (!/^\d+$/.test(clean)) return { value: "", error: "Input harus berupa angka desimal positif." };
  const num = parseInt(clean, 10);
  if (isNaN(num)) return { value: "", error: "Angka desimal tidak valid." };
  return { value: num.toString(2) };
}

export function convertBinaryToDecimal(binStr: string): { value: string; error?: string } {
  const clean = binStr.replace(/\s+/g, "").trim();
  if (!clean) return { value: "" };
  if (!/^[01]+$/.test(clean)) return { value: "", error: "Input biner hanya boleh berisi angka 0 dan 1." };
  const num = parseInt(clean, 2);
  if (isNaN(num)) return { value: "", error: "Biner tidak valid." };
  return { value: num.toString(10) };
}

export function convertDecimalToHex(decStr: string): { value: string; error?: string } {
  const clean = decStr.trim();
  if (!clean) return { value: "" };
  if (!/^\d+$/.test(clean)) return { value: "", error: "Input harus berupa angka desimal positif." };
  const num = parseInt(clean, 10);
  if (isNaN(num)) return { value: "", error: "Angka desimal tidak valid." };
  return { value: num.toString(16).toUpperCase() };
}

export function convertHexToDecimal(hexStr: string): { value: string; error?: string } {
  const clean = hexStr.replace(/^0x/i, "").replace(/\s+/g, "").trim();
  if (!clean) return { value: "" };
  if (!/^[0-9A-Fa-f]+$/.test(clean)) return { value: "", error: "Input heksadesimal hanya boleh berisi karakter 0-9 dan A-F." };
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { value: "", error: "Heksadesimal tidak valid." };
  return { value: num.toString(10) };
}
