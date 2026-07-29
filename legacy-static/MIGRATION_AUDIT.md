# MIGRATION AUDIT: ALLBASE HUB (Legacy -> Next.js Modern Stack)

**Tanggal Audit:** 29 Juli 2026  
**Auditor:** Multi-Role Frontend & Systems Migration Team  
**Repository:** https://github.com/IlalIlhamdi/allbase  
**Domain Production:** https://allbase.my.id  

---

## 1. Struktur Folder Lama (Legacy Static Site)

```text
allbase/
├── index.html                    # Homepage (Hero, About, Skills, Projects, Tools, Certs, Gallery, Contact)
├── profile.jpg                   # Hero profile picture
├── rahmat_ilal.jpg               # Besto Friendo gallery image
├── favicon.ico, favicon.png, ... # Favicons & PWA icons
├── manifest.json                 # Web App Manifest
├── service-worker.js             # Legacy SW caching script
├── robots.txt, sitemap.xml       # SEO files
├── vercel.json                   # Legacy Vercel routing/headers
├── assets/
│   ├── css/                      # variables.css, base.css, layout.css, components.css, subpage.css, animations.css, responsive.css
│   ├── js/                       # utils.js, theme.js, projects.js, filters.js, app.js, subpage.js, config.js
│   └── vendor/                   # cloudflare-speedtest bundles
├── data/
│   ├── projects.json             # Projects and Web Tools catalog
│   ├── skills.json               # Skill categories & proficiency levels
│   └── experience.json           # Certifications and education history
├── tools/
│   ├── internet-speed-test/      # Cloudflare SpeedTest integration
│   ├── subnet-calculator/        # IPv4 Subnet Calculator tool
│   ├── ip-calculator/            # IP & Wildcard Mask tool
│   └── network-converter/        # Decimal / Binary / Hex converter
├── network-converter/            # Mbps to MB/s converter
├── class-schedule/               # College Class Schedule Roster app
├── college-tasks/                # College Tasks Manager app (localStorage)
├── friendship-page/              # Besto Friendo Photo Gallery
└── ilal-gps/                     # Geolocation & GPS Tracker tool
```

---

## 2. Route Aktif & Route Duplikat (Audit & Canonical Decision)

### Route Utama:
1. `/` (Homepage)
2. `/tools/internet-speed-test/` (Speed Test Engine)
3. `/tools/subnet-calculator/` (Subnet Calculator IPv4)
4. `/tools/ip-calculator/` (IP & Mask Calculator)
5. `/tools/network-converter/` (Network Converter: Decimal, Binary, Hex, Mbps/MBps)
6. `/class-schedule/` (Jadwal Perkuliahan)
7. `/college-tasks/` (Pengelola Tugas Kuliah)
8. `/friendship-page/` (Duo Cees Gallery)
9. `/ilal-gps/` (Koordinat GPS Tracker)

### Audit Route Duplikat & Redirect Canonical:
- **Temuan:** Proyek lama memiliki dua folder `network-converter`:
  - Root `/network-converter/` (Konversi Mbps <-> MB/s)
  - Subfolder `/tools/network-converter/` (Konversi Desimal, Biner, Heksadesimal)
- **Keputusan Canonical:** `/tools/network-converter/` akan menjadi route canonical utama yang menyatukan seluruh konversi satuan jaringan (Mbps <-> MB/s dan Desimal <-> Biner <-> Heksadesimal).
- **Redirect Rule:** Menambahkan **308 Permanent Redirect** di `next.config.ts`:
  - `/network-converter` -> `/tools/network-converter/`
  - `/network-converter/` -> `/tools/network-converter/`

---

## 3. Tool & Fungsi Aktif

| Tool Name | Route Canonical | Deskripsi & Logic Utama | Storage / API |
| :--- | :--- | :--- | :--- |
| **Internet Speed Test** | `/tools/internet-speed-test/` | Mengukur Download, Upload, Ping, Jitter, dan Quality Score. | `@cloudflare/speedtest` |
| **Subnet Calculator** | `/tools/subnet-calculator/` | Hitung CIDR /0-/32, Subnet Mask, Network, Broadcast, Wildcard, Usable Host Range. | Pure TS (`src/lib/network.ts`) |
| **IP & Mask Calculator** | `/tools/ip-calculator/` | Alokasi blok IP & Wildcard mask. | Pure TS |
| **Network Converter** | `/tools/network-converter/` | Konversi Mbps <-> MB/s & Desimal <-> Biner <-> Hex. | Pure TS |
| **Class Schedule** | `/class-schedule/` | Roster perkuliahan TRJT 2A (Jadwal, Kelompok MK, Piket, Daftar Mhs, Dosen). | Static JSON / TS data |
| **College Tasks** | `/college-tasks/` | Catatan & manajemen deadline tugas kuliah. | `localStorage` (`allbase-college-tasks`) |
| **Friendship Gallery** | `/friendship-page/` | Galeri momen kolaborasi Rahmat & Ilal dengan Lightbox preview. | Static Image Assets |
| **Ilal GPS Tracker** | `/ilal-gps/` | Deteksi lokasi koordinat real-time pengguna via browser Geolocation. | Browser `navigator.geolocation` |

---

## 4. Audit Link Sertifikat & Penerbit (Strict Verification)

- **MikroTik Certified Network Associate (MTCNA)**
  - Penerbit: MikroTik
  - Tahun: 2025
  - Credential URL: Tidak ada (TETAP DIJAGA KOSONG)
- **CCNA: Introduction to Networks**
  - Penerbit: Cisco Networking Academy
  - Tahun: 2026
  - Credential URL: `https://www.credly.com/badges/ddefb255-6d2c-488f-a53e-c4ad6f84c327/public_url`
  - Teks Verifikasi: "Verifikasi di Credly"
- **Fundamental of Associate Network Administrator – Nasional**
  - Penerbit: Digital Talent Academy
  - Tahun: 2026
  - Credential URL: `https://mapi.sdmdigital.id/get-file?path=output_signed/212-1322-12087/3568e731-34e6-4f2c-a0a2-4a3eae5bd068.pdf&disk=dts-storage-sertifikat`
  - Teks Verifikasi: "Lihat Sertifikat Resmi"

---

## 5. Audit Link Sosial & Identitas Pengguna

- **Nama Pengguna:** Ilal Ilhamdi
- **Gelar/Sub-title:** Network & Technology Enthusiast
- **WhatsApp:** `https://wa.me/6282322085606`
- **GitHub:** `https://github.com` (atau URL profile yang valid)
- **Email:** `mailto:ilal@example.com`

---

## 6. Audit Asset Gambar & Meta File

- `profile.jpg` -> Foto profil utama di hero section.
- `rahmat_ilal.jpg` -> Foto kebersamaan sahabat Rahmat & Ilal.
- `favicon.ico`, `favicon-96.png`, `favicon.png`, `apple-touch-icon.png` -> Favicon & Apple icons.
- `icon-192.png`, `icon-512.png` -> PWA Icons.

---

## 7. Audit Service Worker & PWA

- `service-worker.js` lama meng-cache asset statis Vanilla HTML/JS.
- **Rencana Transisi:**
  1. Pada Preview Deployment awal, menonaktifkan Service Worker lama dan membersihkan cache lama via script unregister / cache purge di client component `ThemeProvider`.
  2. Implementasikan Next.js Compatible PWA manifest (`src/app/manifest.ts`) dan service worker modern untuk asset static public tanpa meng-cache API speed test atau URL Next.js build dynamic runtime.

---

## 8. Checklist Safe Git & Vercel Migration Strategy

- [x] Pastikan working tree `main` bersih.
- [ ] Tag commit saat ini: `git tag before-nextjs-migration`
- [ ] Push tag: `git push origin before-nextjs-migration`
- [ ] Buat branch migrasi: `git checkout -b upgrade-nextjs`
- [ ] Push branch: `git push -u origin upgrade-nextjs`
- [ ] Pindahkan salinan lama ke `legacy-static/` (kecuali `.git`).
- [ ] Setup Next.js App Router, TypeScript, CSS Modules, Lucide React pada branch `upgrade-nextjs`.
- [ ] Verifikasi build & Preview Deployment Vercel dari branch `upgrade-nextjs`.
- [ ] JANGAN LAKUKAN merge ke `main` sebelum verifikasi penuh disetujui.
