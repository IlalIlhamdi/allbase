import { Wrench } from "lucide-react";
import { toolsData } from "@/data/tools";
import ToolCard from "@/components/cards/ToolCard";

export default function Tools() {
  return (
    <section id="tools" className="section section-alt" aria-labelledby="tools-title">
      <div className="container">
        <div className="sectionHeader">
          <span className="sectionBadge">
            <Wrench size={14} /> Produktivitas &amp; Analisis
          </span>
          <h2 id="tools-title" className="sectionTitle">
            Web Tools &amp; Utilitas Jaringan
          </h2>
          <p className="sectionDescription">
            Alat kalkulasi subnet IPv4 presisi, pengukuran throughput koneksi real-time, dan konverter satuan telekomunikasi.
          </p>
        </div>

        <div className="cardsGrid">
          {toolsData.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
