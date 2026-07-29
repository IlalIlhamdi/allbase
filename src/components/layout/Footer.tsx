import Link from "next/link";
import { Layers, ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        paddingBlock: "32px",
        marginTop: "auto",
        transition: "background-color var(--transition-normal), border-color var(--transition-normal)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--color-primary-600)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Layers size={18} />
            </div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
              ALLBASE <span style={{ color: "var(--color-primary-600)" }}>HUB</span>
            </div>
          </div>

          <Link
            href="#hero"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "var(--color-text-primary)",
            }}
            title="Kembali ke Atas"
          >
            <ArrowUp size={16} /> Kembali ke Atas
          </Link>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "16px",
            fontSize: "0.88rem",
            color: "var(--color-text-secondary)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div>&copy; 2026 Ilal Ilhamdi. Seluruh Hak Cipta Dilindungi.</div>
          <div>Network &amp; Technology Enthusiast</div>
        </div>
      </div>
    </footer>
  );
}
