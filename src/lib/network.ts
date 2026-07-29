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
}

export function isValidIPv4(ip: string): boolean {
  if (typeof ip !== "string") return false;
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    const num = parseInt(p, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && p === num.toString();
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

export function getIPClass(firstOctet: number): string {
  if (firstOctet >= 1 && firstOctet <= 126) return "Kelas A";
  if (firstOctet === 127) return "Loopback";
  if (firstOctet >= 128 && firstOctet <= 191) return "Kelas B";
  if (firstOctet >= 192 && firstOctet <= 223) return "Kelas C";
  if (firstOctet >= 224 && firstOctet <= 239) return "Kelas D (Multicast)";
  return "Kelas E (Experimental)";
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
    usableHosts = 2;
    firstHost = network;
    lastHost = broadcast;
  } else if (cleanPrefix === 32) {
    usableHosts = 1;
    firstHost = network;
    lastHost = network;
  }

  return {
    ip,
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
  if (isNaN(num)) return { binary: "00000000", hex: "0" };
  const cleanNum = Math.max(0, Math.floor(num));
  return {
    binary: cleanNum.toString(2).padStart(8, "0"),
    hex: cleanNum.toString(16).toUpperCase(),
  };
}
