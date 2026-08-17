import type { Metadata } from "next";
import InternetSpeedTestWrapper from "@/components/tools/InternetSpeedTestWrapper";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Internet Speed Test — ALLBASE",
  description: "Uji kecepatan download, upload, ping, jitter, dan kualitas koneksi Internet secara real-time menggunakan Internet Speed Test ALLBASE.",
  canonical: "/tools/internet-speed-test",
});

export default function SpeedTestPage() {
  return (
    <div style={{ width: "100%", paddingBottom: "24px" }}>
      <InternetSpeedTestWrapper />
    </div>
  );
}
