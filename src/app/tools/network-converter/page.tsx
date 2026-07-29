import type { Metadata } from "next";
import NetworkConverter from "@/components/tools/NetworkConverter";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Konversi Satuan Jaringan — ALLBASE",
  description: "Alat konversi kecepatan internet dua arah (Mbps ke MB/s) serta format bilangan desimal, biner, dan heksadesimal.",
  canonical: "/tools/network-converter/",
});

export default function NetworkConverterPage() {
  return (
    <div className="container" style={{ paddingBlock: "48px" }}>
      <NetworkConverter />
    </div>
  );
}
