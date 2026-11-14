import { ArrowRight } from "lucide-react";
import { socialLinks } from "@/data/social-links";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section id="contact" className={styles.contactSection} aria-labelledby="contact-title">
      <div className={styles.contactContainer}>
        <div className={styles.contactCard}>
          {/* Bottom-Right 3D Blue Faceted Prism Artwork */}
          <svg
            className={styles.prismSvg}
            viewBox="0 0 140 130"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="contactPrismBright" x1="20" y1="125" x2="96" y2="12" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0b4da8" />
                <stop offset="100%" stopColor="#1b78ef" />
              </linearGradient>
              <linearGradient id="contactPrismMid" x1="88" y1="12" x2="132" y2="128" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0d52b5" />
                <stop offset="100%" stopColor="#062863" />
              </linearGradient>
              <linearGradient id="contactPrismBase" x1="22" y1="120" x2="128" y2="128" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#073579" />
                <stop offset="100%" stopColor="#041c46" />
              </linearGradient>
            </defs>
            {/* Left Lit Facet */}
            <polygon points="18,124 94,10 78,94" fill="url(#contactPrismBright)" opacity="0.9" />
            {/* Right Shaded Facet */}
            <polygon points="94,10 138,128 78,94" fill="url(#contactPrismMid)" opacity="0.92" />
            {/* Lower Fold Facet */}
            <polygon points="18,124 78,94 138,128" fill="url(#contactPrismBase)" opacity="0.95" />
          </svg>

          <div className={styles.cardInner}>
            {/* Left Column: Heading, Subtitle, Pill CTA */}
            <div className={styles.leftCol}>
              <h2 id="contact-title" className={styles.title}>
                Punya ide menarik?
              </h2>
              <p className={styles.subtitle}>Mari mulai percakapan.</p>
              <a href={socialLinks.email} className={styles.ctaBtn}>
                <span>Hubungi Saya</span>
                <ArrowRight size={14} strokeWidth={2.4} />
              </a>
            </div>

            {/* Right Column: GitHub & WhatsApp Direct Links */}
            <div className={styles.rightCol}>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </a>

              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.359 5.016L2 22l5.141-1.344a9.927 9.927 0 0 0 4.89 1.281c5.516 0 9.969-4.453 9.969-9.968S17.547 2 12.031 2zm0 18.281a8.28 8.28 0 0 1-4.219-1.156l-.3-.18-3.125.813.836-3.047-.195-.313a8.273 8.273 0 0 1-1.281-4.43c0-4.578 3.727-8.297 8.284-8.297 4.57 0 8.297 3.719 8.297 8.297 0 4.579-3.727 8.313-8.297 8.313zm4.547-6.219c-.25-.125-1.477-.727-1.703-.812-.227-.086-.391-.125-.555.125-.164.25-.641.812-.781.977-.141.164-.289.187-.539.062-.25-.125-1.055-.391-2.008-1.242-.742-.664-1.242-1.484-1.391-1.734-.148-.25-.016-.383.109-.508.11-.109.25-.289.375-.43.125-.14.164-.25.25-.414.086-.164.039-.312-.023-.437-.063-.125-.555-1.344-.766-1.836-.203-.484-.406-.422-.555-.43-.14-.008-.304-.008-.468-.008-.164 0-.438.063-.664.313-.227.25-.875.852-.875 2.078s.898 2.414 1.023 2.578c.125.164 1.766 2.695 4.273 3.781.594.258 1.063.414 1.422.531.602.188 1.148.164 1.578.102.484-.07 1.477-.602 1.688-1.188.21-.586.21-1.086.148-1.187-.063-.102-.227-.164-.477-.289z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
