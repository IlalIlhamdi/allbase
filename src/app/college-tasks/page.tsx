import type { Metadata } from "next";
import CollegeTasks from "@/components/tasks/CollegeTasks";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Pengelola Tugas Kuliah — ALLBASE",
  description: "Aplikasi pencatatan dan manajemen daftar tugas perkuliahan harian dengan reminder deadline interaktif.",
  canonical: "/college-tasks/",
});

export default function CollegeTasksPage() {
  return (
    <div className="container" style={{ paddingBlock: "48px" }}>
      <CollegeTasks />
    </div>
  );
}
