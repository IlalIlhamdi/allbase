# ALLBASE — Static Personal Portfolio & Tools Hub

ALLBASE adalah pusat portofolio pribadi, proyek jaringan telekomunikasi, dan berbagai web tools yang dibangun oleh **Ilal Ilhamdi**.

Proyek ini dibangun murni menggunakan **HTML5, Vanilla CSS, dan JavaScript (ES6+)** tanpa ketergantungan pada backend PHP, MySQL, maupun Python Flask. Proyek ini 100% statis dan siap dideploy langsung ke **Vercel** melalui **GitHub Automatic Deployment**.

---

## 📁 Struktur Folder

```
/
├── index.html                  # Halaman portofolio & hub utama
├── manifest.json               # Konfigurasi PWA (Progressive Web App)
├── service-worker.js           # PWA offline shell cache script
├── offline.html                # Halaman fallback saat perangkat offline
├── sitemap.xml                 # Sitemap XML untuk SEO
├── robots.txt                  # Pengaturan crawler Google & mesin pencari
├── favicon.png                 # Icon situs ALLBASE
├── vercel.json                 # Konfigurasi header & routing Vercel
├── .gitignore                  # Mengabaikan file yang tidak perlu di-push
├── README.md                   # Dokumentasi lengkap proyek
│
├── assets/
│   ├── css/
│   │   ├── variables.css       # Token warna (White & Blue) & Dark Mode Navy
│   │   ├── base.css            # Reset, tipografi, & accessibility
│   │   ├── components.css      # Style tombol, kartu, badge, & modal
│   │   ├── layout.css          # Header, hero 2-kolom, & section layout
│   │   ├── animations.css      # Animasi AI scanner halus & status pulse
│   │   └── responsive.css      # Breakpoints responsif & mobile drawer
│   │
│   ├── js/
│   │   ├── app.js              # Controller utama & navbar active observer
│   │   ├── projects.js         # Fetcher data/projects.json, skills, & experience
│   │   ├── filters.js          # Realtime search & tab filter kategori
│   │   ├── theme.js            # Light/Dark mode switcher (localStorage)
│   │   └── utils.js            # Debounce, HTML escape, & 3D tilt effect
│   │
│   └── images/
│       ├── profile.jpg         # Foto profil Ilal Ilhamdi
│       ├── rahmat_ilal.jpg     # Foto galeri personal / sahabat
│       └── projects/           # Gambar thumbnail proyek & tools
│
├── data/
│   ├── projects.json           # SUMBER DATA UTAMA (Proyek & Tools)
│   ├── skills.json             # Data keahlian & teknologi
│   └── experience.json         # Data sertifikasi & pendidikan
│
└── tools/                      # Web tools internal standalone
    ├── subnet-calculator/
    │   └── index.html          # Subnet Calculator IPv4
    ├── ip-calculator/
    │   └── index.html          # IP & Mask Calculator
    └── network-converter/
        └── index.html          # Converter Biner/Hex/Prefix
```

---

## 💻 1. Cara Menjalankan Secara Lokal

Karena ALLBASE tidak membutuhkan server PHP atau database MySQL, Anda dapat menjalankannya langsung di browser:

1. Buka folder `allbase` di komputer Anda.
2. Klik dua kali pada file **`index.html`** untuk membukanya di browser (Chrome, Edge, Firefox).
3. **Atau** jika menggunakan VS Code, instal ekstensi **Live Server**, lalu klik kanan `index.html` &rarr; **Open with Live Server**.

---

## ➕ 2. Cara Menambahkan Proyek Baru

Untuk menambahkan proyek baru, Anda **TIDAK PERLU** mengedit file HTML. Cukup tambahkan data proyek baru ke file **`data/projects.json`**.

### Langkah-langkah:
1. Buka file **`data/projects.json`**.
2. Tambahkan objek JSON baru di dalam array:

```json
{
  "id": "nama-proyek-baru",
  "title": "Nama Proyek Baru Anda",
  "description": "Deskripsi singkat mengenai proyek yang telah atau sedang dikembangkan.",
  "category": "Web Development",
  "type": "project",
  "thumbnail": "assets/images/projects/nama-proyek-baru.jpg",
  "icon": "folder-code",
  "tags": ["HTML", "CSS", "JavaScript"],
  "url": "https://nama-proyek.vercel.app",
  "repository": "https://github.com/username/nama-proyek",
  "status": "completed",
  "featured": false,
  "openMode": "new-tab"
}
```

3. Simpan file `projects.json`.
4. Tambahkan gambar thumbnail proyek ke folder `assets/images/projects/`.
5. Commit dan Push perubahan ke GitHub. Vercel akan otomatis meng-update website Anda dalam beberapa detik!

---

## 🔧 3. Cara Menambahkan Web Tool Baru

Sama seperti menambahkan proyek, tambahkan objek baru ke `data/projects.json` dengan merubah nilai `"type": "tool"`:

```json
{
  "id": "tool-password-generator",
  "title": "Password Generator",
  "description": "Alat pembuat kata sandi acak yang aman.",
  "category": "Tools",
  "type": "tool",
  "thumbnail": "assets/images/projects/pass-gen.jpg",
  "icon": "key",
  "tags": ["Security", "Tool"],
  "url": "tools/password-generator/index.html",
  "repository": "",
  "status": "completed",
  "featured": false,
  "openMode": "same-tab"
}
```

---

## ⏳ 4. Cara Menangani Proyek yang Belum Memiliki URL ("Segera Hadir")

Jika Anda ingin menampilkan daftar proyek yang sedang direncanakan tetapi belum memiliki URL:

1. Kosongkan nilai `"url"` (`"url": ""`).
2. Ubah `"status"` menjadi `"upcoming"` atau `"development"`.
3. Secara otomatis, sistem ALLBASE akan menampilkan tombol **"Segera Hadir"** dengan kondisi *disabled* yang tidak bisa diklik.

---

## 🛠️ 5. Cara Membuat Tool Internal Baru Standalone

1. Buat folder baru di dalam direktori `tools/`, contoh: `tools/password-generator/`.
2. Buat file `index.html` di dalam folder tersebut.
3. Hubungkan style `assets/css/variables.css` dan komponen ALLBASE menggunakan path relatif `../../assets/css/variables.css`.
4. Daftarkan URL tool tersebut pada `data/projects.json`.

---

## 📷 6. Cara Mengganti Foto Profil & Gambar

- **Foto Profil Utama:** Ganti file `assets/images/profile.jpg` (atau `profile.jpg` pada root) dengan foto baru Anda.
- **Foto Galeri / Besto Friendo:** Ganti file `assets/images/rahmat_ilal.jpg` (atau `rahmat_ilal.jpg` pada root).
- Pastikan nama file tetap sama agar tidak perlu mengedit path HTML.

---

## 🔗 7. Cara Mengganti Link Sosial Media

Buka file **`index.html`**, lalu cari bagian `class="social-links"` di area Hero dan `id="contact"`. Ganti URL pada atribut `href="..."`:
- **WhatsApp:** `https://wa.me/6282322085606` (ganti dengan nomor Anda).
- **GitHub:** `https://github.com/username-anda`.
- **Email:** `mailto:emailanda@domain.com`.

---

## 🚀 8. Panduan Deployment dari GitHub ke Vercel

ALLBASE dirancang khusus untuk kemudahan deployment gratis di Vercel:

### Langkah 1: Push ke GitHub
1. Inisialisasi repository git jika belum:
   ```bash
   git init
   git add .
   git commit -m "Initial commit ALLBASE Static Hub"
   ```
2. Buat repository baru di GitHub (misal: `allbase-hub`).
3. Hubungkan dan push kode Anda:
   ```bash
   git remote add origin https://github.com/username-anda/allbase-hub.git
   git branch -M main
   git push -u origin main
   ```

### Langkah 2: Import ke Vercel
1. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan login menggunakan akun GitHub Anda.
2. Klik tombol **"Add New..."** &rarr; **"Project"**.
3. Pilih repository `allbase-hub` dari daftar GitHub.
4. Pada bagian **Framework Preset**, pilih **Other**.
5. Pada bagian **Root Directory**, biarkan `./`.
6. Bagian Build Command & Output Directory biarkan kosong.
7. Klik **Deploy**.
8. Dalam waktu ~15 detik, website ALLBASE Anda akan live dengan URL seperti `https://allbase-hub.vercel.app`.

---

## 🌐 9. Cara Mengganti Domain, Sitemap, & Manifest

Setelah deployment di Vercel selesai dan Anda mendapatkan domain kustom (misal: `https://allbase.id` atau `https://namaanda.vercel.app`):

1. **Update Sitemap (`sitemap.xml`):** Ganti `https://allbase.my.id/` dengan domain asli Anda.
2. **Update Manifest (`manifest.json`):** Sesuaikan `name` dan `description` jika diperlukan.
3. **Update Robots (`robots.txt`):** Ganti link sitemap pada baris terakhir `Sitemap: https://domain-anda.vercel.app/sitemap.xml`.

---

## ✅ Checklist Pengujian & Kualitas

- [x] Tema dominan putih dan biru modern terpasang rapi.
- [x] 100% Statis tanpa request ke PHP, MySQL, maupun Flask.
- [x] Data proyek & tools terbaca secara dinamis dari `data/projects.json`.
- [x] Realtime search bar dan filter kategori berfungsi presisi.
- [x] Proyek tanpa URL menampilkan tombol "Segera Hadir" (disabled).
- [x] Light / Dark mode switcher berjalan lancar dan tersimpan di `localStorage`.
- [x] Tampilan responsif sempurna di Desktop, Tablet, dan Smartphone (tanpa overflow horizontal).
- [x] PWA Service Worker dan halaman `offline.html` siap digunakan.
- [x] Siap dideploy ke Vercel via GitHub Automatic Deployment.
