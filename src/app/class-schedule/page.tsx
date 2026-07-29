import type { Metadata } from "next";
import ClassSchedule from "@/components/schedule/ClassSchedule";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Jadwal Kuliah Roster — ALLBASE",
  description: "Informasi jadwal perkuliahan mingguan TRJT 2A, jam kuliah, dan ruang kelas yang interaktif.",
  canonical: "/class-schedule/",
});

export default function ClassSchedulePage() {
  return (
    <div className="container" style={{ paddingBlock: "48px" }}>
      <ClassSchedule />
    </div>
  );
}
