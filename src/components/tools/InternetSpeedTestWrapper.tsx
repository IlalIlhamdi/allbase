"use client";

import dynamic from "next/dynamic";

const InternetSpeedTestClient = dynamic(
  () => import("@/components/tools/InternetSpeedTest"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          padding: "48px",
          textAlign: "center",
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)",
        }}
      >
        Memuat Engine Internet Speed Test...
      </div>
    ),
  }
);

export default function InternetSpeedTestWrapper() {
  return <InternetSpeedTestClient />;
}
