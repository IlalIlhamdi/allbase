import type { Metadata } from "next";
import InternetSpeedTestWrapper from "@/components/tools/InternetSpeedTestWrapper";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Internet Speed Test — ALLBASE",
  description: "Uji kecepatan download, upload, ping, jitter, dan kualitas koneksi Internet secara real-time menggunakan Internet Speed Test ALLBASE.",
  canonical: "/tools/internet-speed-test",
});

export default function SpeedTestPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Internet Speed Test — ALLBASE",
    "url": "https://allbase.my.id/tools/internet-speed-test",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "description": "Pengukuran kecepatan download, upload, ping, dan jitter internet aktual via M-Lab NDT7 protocol.",
    "author": {
      "@type": "Person",
      "name": "Ilal Ilhamdi",
    },
  };

  return (
    <div style={{ width: "100%", paddingBottom: "24px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InternetSpeedTestWrapper />
    </div>
  );
}
