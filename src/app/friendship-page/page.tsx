import type { Metadata } from "next";
import FriendshipGallery from "@/components/friendship/FriendshipGallery";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Duo Cees — ALLBASE",
  description: "Duo Cees - Galeri momen, kebersamaan, dan dokumentasi kolaborasi Rahmat Haikal & Ilal Ilhamdi.",
  canonical: "/friendship-page/",
});

export default function FriendshipPage() {
  return (
    <div className="container" style={{ paddingBlock: "48px" }}>
      <FriendshipGallery />
    </div>
  );
}
