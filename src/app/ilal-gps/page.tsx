import type { Metadata } from "next";
import IlalGps from "@/components/gps/IlalGps";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Deteksi Lokasi GPS — ALLBASE",
  description: "Alat pelacak lokasi geolokasi real-time dan pemetaan koordinat GPS perangkat.",
  canonical: "/ilal-gps",
});

export default function IlalGpsPage() {
  return (
    <div className="container" style={{ paddingBlock: "48px" }}>
      <IlalGps />
    </div>
  );
}
