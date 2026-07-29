import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Skills from "@/components/home/Skills";
import Projects from "@/components/home/Projects";
import Tools from "@/components/home/Tools";
import Certifications from "@/components/home/Certifications";
import Contact from "@/components/home/Contact";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "name": "Ilal Ilhamdi",
        "url": "https://allbase.my.id/",
        "image": "https://allbase.my.id/profile.jpg",
        "jobTitle": "Network & Technology Enthusiast",
        "sameAs": [
          "https://github.com/IlalIlhamdi/allbase",
          "https://www.credly.com/badges/ddefb255-6d2c-488f-a53e-c4ad6f84c327/public_url",
        ],
      },
      {
        "@type": "WebSite",
        "name": "ALLBASE",
        "url": "https://allbase.my.id/",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Tools />
      <Certifications />
      <Contact />
    </>
  );
}
