import type { Metadata } from "next";
import SubnetCalculator from "@/components/tools/SubnetCalculator";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Subnet Calculator IPv4 — ALLBASE",
  description: "Hitung network address, broadcast address, subnet mask, wildcard mask, dan rentang host IPv4 presisi.",
  canonical: "/tools/subnet-calculator",
});

export default function SubnetCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Subnet Calculator IPv4 — ALLBASE",
    "url": "https://allbase.my.id/tools/subnet-calculator",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "description": "Kalkulator subnet IPv4 presisi untuk pembagian network address, broadcast address, wildcard mask, dan jumlah usable host.",
    "author": {
      "@type": "Person",
      "name": "Ilal Ilhamdi",
    },
  };

  return (
    <div className="container" style={{ paddingBlock: "48px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SubnetCalculator />
    </div>
  );
}
