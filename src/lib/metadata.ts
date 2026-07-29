import type { Metadata } from "next";

export const siteConfig = {
  name: "ALLBASE",
  title: "ALLBASE — Portfolio, Projects & Tools | Ilal Ilhamdi",
  description: "ALLBASE adalah pusat portofolio, proyek jaringan, teknologi, dan berbagai tools yang dikembangkan oleh Ilal Ilhamdi.",
  url: "https://allbase.my.id",
  ogImage: "https://allbase.my.id/profile.jpg",
  author: "Ilal Ilhamdi",
};

export function constructMetadata({
  title = siteConfig.title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  canonical = "/",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const fullCanonicalUrl = new URL(canonical, siteConfig.url).toString();

  return {
    title,
    description,
    authors: [{ name: siteConfig.author }],
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: fullCanonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: fullCanonicalUrl,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
