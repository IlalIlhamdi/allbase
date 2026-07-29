import { SkillCategory } from "@/types/skill";

export const skillsData: readonly SkillCategory[] = [
  {
    category: "Networking",
    icon: "network",
    description: "Desain, konfigurasi, dan pemeliharaan infrastruktur jaringan telekomunikasi.",
    items: [
      { name: "Cisco Router & Switch", icon: "cpu", level: "Advanced" },
      { name: "MikroTik RouterOS", icon: "server", level: "Advanced" },
      { name: "Subnetting IPv4 / CIDR", icon: "calculator", level: "Expert" },
      { name: "GNS3 & Packet Tracer", icon: "activity", level: "Advanced" },
    ],
  },
  {
    category: "Network Monitoring",
    icon: "activity",
    description: "Monitoring jaringan real-time dan analisis log performa sistem.",
    items: [
      { name: "Prometheus", icon: "database", level: "Intermediate" },
      { name: "Grafana Dashboard", icon: "bar-chart-2", level: "Advanced" },
      { name: "Alertmanager", icon: "bell", level: "Intermediate" },
      { name: "MKTXP Exporter", icon: "share-2", level: "Intermediate" },
    ],
  },
  {
    category: "Web Development",
    icon: "code",
    description: "Pengembangan antarmuka web modern yang responsif, cepat, dan terstruktur.",
    items: [
      { name: "Next.js & App Router", icon: "layers", level: "Advanced" },
      { name: "React & TypeScript", icon: "code-2", level: "Advanced" },
      { name: "HTML5 & Semantic Markup", icon: "file-code", level: "Expert" },
      { name: "CSS Modules & CSS Variables", icon: "palette", level: "Advanced" },
    ],
  },
  {
    category: "Cloud & Virtualization",
    icon: "cloud",
    description: "Virtualisasi server dan deployment web terdistribusi.",
    items: [
      { name: "Proxmox VE", icon: "server", level: "Intermediate" },
      { name: "VMware Workstation", icon: "monitor", level: "Advanced" },
      { name: "GitHub & Git Version Control", icon: "git-branch", level: "Advanced" },
      { name: "Vercel Auto Deployment", icon: "zap", level: "Advanced" },
    ],
  },
];
