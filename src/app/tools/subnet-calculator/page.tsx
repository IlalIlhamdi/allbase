import type { Metadata } from "next";
import SubnetCalculator from "@/components/tools/SubnetCalculator";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Subnet Calculator IPv4 — ALLBASE",
  description: "Hitung network address, broadcast address, subnet mask, wildcard mask, dan rentang host IPv4 presisi.",
  canonical: "/tools/subnet-calculator",
});

export default function SubnetCalculatorPage() {
  return (
    <div className="container" style={{ paddingBlock: "48px" }}>
      <SubnetCalculator />
    </div>
  );
}
