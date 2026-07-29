import type { Metadata } from "next";
import IpCalculator from "@/components/tools/IpCalculator";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "IP & Mask Calculator — ALLBASE",
  description: "Alat pembagi alokasi blok IP address dan perincian wildcard mask untuk analisis jaringan telekomunikasi.",
  canonical: "/tools/ip-calculator/",
});

export default function IpCalculatorPage() {
  return (
    <div className="container" style={{ paddingBlock: "48px" }}>
      <IpCalculator />
    </div>
  );
}
