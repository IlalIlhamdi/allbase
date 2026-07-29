import type { Metadata } from "next";
import InternetSpeedTestWrapper from "@/components/tools/InternetSpeedTestWrapper";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Internet Speed Test — ALLBASE",
  description: "Uji kecepatan download, upload, ping, jitter, dan kualitas koneksi Internet menggunakan Internet Speed Test ALLBASE.",
  canonical: "/tools/internet-speed-test/",
});

export default function SpeedTestPage() {
  return (
    <div className="container" style={{ paddingBlock: "48px" }}>
      <InternetSpeedTestWrapper />
    </div>
  );
}
