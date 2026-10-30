import { ArrowRight, Mail } from "lucide-react";
import { socialLinks } from "@/data/social-links";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section id="contact" className={styles.contactSection} aria-label="Kontak">
      {/* =====================================================================
          DESKTOP CONTACT BANNER (>= 768px)
          ===================================================================== */}
      <div className={`container ${styles.desktopContact}`}>
        <div className={styles.bannerCard}>
          {/* Decorative Paper Airplane & Low-Poly Ice Crystals SVG */}
          <svg
            className={styles.bannerSvg}
            viewBox="0 0 1120 230"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            {/* Subtle Network Lines */}
            <g stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.2">
              <line x1="780" y1="30" x2="860" y2="65" />
              <line x1="860" y1="65" x2="940" y2="25" />
              <line x1="860" y1="65" x2="890" y2="125" />
            </g>
            <g fill="#ffffff" fillOpacity="0.28">
              <circle cx="780" cy="30" r="3" />
              <circle cx="860" cy="65" r="3.5" />
              <circle cx="940" cy="25" r="3" />
            </g>

            {/* Left Low-Poly Ice Crystals */}
            <polygon points="-20,235 55,150 115,235" fill="#ffffff" opacity="0.25" />
            <polygon points="45,235 110,165 170,235" fill="#d9ebff" opacity="0.35" />
            <polygon points="100,235 148,182 195,235" fill="#ffffff" opacity="0.45" />

            {/* Right Low-Poly Ice Crystal Mountains */}
            <polygon points="730,235 835,125 920,235" fill="#89bfff" opacity="0.35" />
            <polygon points="815,235 935,95 1045,235" fill="#d7ebff" opacity="0.82" />
            <polygon points="935,95 1045,235 1110,145" fill="#a8d1ff" opacity="0.85" />
            <polygon points="985,235 1075,115 1155,235" fill="#ffffff" opacity="0.92" />
            <polygon points="865,235 940,155 1015,235" fill="#ffffff" opacity="0.9" />

            {/* Large White Paper Airplane on Left */}
            <g transform="translate(36, 36) rotate(-8)">
              <polygon points="0,60 138,0 66,82" fill="#ffffff" />
              <polygon points="66,82 138,0 84,106" fill="#c7e1ff" />
              <polygon points="66,82 84,106 54,94" fill="#8ebef8" />
            </g>
          </svg>

          {/* Main Banner Text & Buttons */}
          <div className={styles.contentWrap}>
            <h2 className={styles.title}>Mari Terhubung</h2>

            <p className={styles.description}>
              Diskusi, kolaborasi, atau sekadar menyapa. Saya selalu terbuka untuk
              berjejaring dengan teman-teman yang memiliki minat serupa.
            </p>

            <div className={styles.buttonsRow}>
              {/* GitHub */}
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="GitHub"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={styles.githubIcon}
                  aria-hidden="true"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className={styles.btnLabel}>GitHub</span>
              </a>

              {/* WhatsApp */}
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="WhatsApp"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={styles.waIcon}
                  aria-hidden="true"
                >
                  <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.359 5.016L2 22l5.141-1.344a9.927 9.927 0 0 0 4.89 1.281c5.516 0 9.969-4.453 9.969-9.968S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.531.078-1.203.109-1.953-.125-.453-.141-1.047-.344-1.797-.672-3.156-1.359-5.219-4.547-5.375-4.75-.156-.203-1.281-1.703-1.281-3.25s.813-2.313 1.094-2.625c.281-.312.625-.391.828-.391.203 0 .406.016.594.016.188 0 .438-.078.688.531.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.094.203-.141.328-.297.5-.156.172-.313.391-.453.531-.141.141-.297.297-.125.594.172.297.766 1.266 1.641 2.047 1.125 1 2.078 1.313 2.375 1.453.297.141.469.125.641-.078.172-.203.75-.875.953-1.172.203-.297.406-.25.672-.156.266.094 1.703.813 1.984.953.281.141.469.219.547.344.078.125.078.719-.172 1.422z" />
                </svg>
                <span className={styles.btnLabel}>WhatsApp</span>
              </a>

              {/* Email */}
              <a
                href={socialLinks.email}
                className={styles.socialBtn}
                aria-label="Email"
              >
                <Mail size={18} className={styles.mailIcon} />
                <span className={styles.btnLabel}>Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MOBILE & iOS DARK NAVY CTA CARD (<= 767px)
          ===================================================================== */}
      <div className={styles.mobileContact}>
        <div className={styles.mobileCard}>
          {/* Bottom-Right 3D Blue Faceted Prism Artwork */}
          <svg
            className={styles.mobilePrismSvg}
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

          <div className={styles.mobileCardInner}>
            {/* Left Column: Heading, Subtitle, Pill CTA */}
            <div className={styles.mobileLeft}>
              <h2 className={styles.mobileTitle}>Punya ide menarik?</h2>
              <p className={styles.mobileSubtitle}>Mari mulai percakapan.</p>
              <a href={socialLinks.email} className={styles.mobileCtaBtn}>
                <span>Hubungi Saya</span>
                <ArrowRight size={14} strokeWidth={2.4} />
              </a>
            </div>

            {/* Right Column: GitHub & WhatsApp Direct Links */}
            <div className={styles.mobileRight}>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileSocialLink}
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
                className={styles.mobileSocialLink}
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
