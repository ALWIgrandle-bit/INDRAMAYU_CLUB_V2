# 🕌 Indramayu Club — Nur System & Peta COD Makrifat

Selamat datang di repositori ekosistem **Indramayu Club**. Project ini mengintegrasikan aplikasi web berbasis HTML5/JS interaktif, sistem manajemen AI (Nur System), simulator sirkuit kuantum 2-qubit, serta fitur pemetaan lokasi dan navigasi COD (Cash on Delivery) wilayah Indramayu.

---

## 📜 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Struktur Berkas Kode](#-struktur-berkas-kode)
- [Penjelasan Komponen & Modul](#-penjelasan-komponen--modul)
  - [1. Nur System App (`index.html`)](#1-nur-system-app-indexhtml)
  - [2. Peta COD 3 Titik (`peta-cod.html`)](#2-peta-cod-3-titik-peta-codhtml)
  - [3. Pos Tengah Awi (`peta-cod22.html`)](#3-pos-tengah-awi-peta-cod22html)
  - [4. Agen Navigasi Alwi (`nav_alwi.js`)](#4-agen-navigasi-alwi-nav_alwijs)
- [Panduan Penggunaan](#-panduan-penggunaan)
- [Teknologi & Dependensi](#-teknologi--dependensi)

---

## ✨ Fitur Utama

1. **Nur Creative Lab & AI Engine:**
   - Integrasi Gemini API dan engine cache offline (*Alwi Cache*).
   - Fitur live code preview & editor HTML/CSS.
   - Fitur simpan catatan draf (*Keep*) dan sintesis suara (*Web Speech API*).
2. **Kalkulator Berkah:**
   - Kalkulator interaktif bertema khusus (*Global Blessing System*) untuk perhitungan cepat.
3. **Simulator Kuantum:**
   - Simulasi sirkuit kuantum 2-Qubit ($Q_0, Q_1$) dengan gerbang Hadamard ($H$), Pauli-X ($X$), dan $CNOT$.
   - Kalkulasi State-Vector, probabilitas amplitudo, dan sampling hasil pengukuran (1000 *shots*).
   - Asisten AI Kuantum untuk auto-analisis konsep sirkuit.
4. **Sistem Navigasi & Peta COD Indramayu:**
   - **Pemetaan Interaktif:** Pemetaan titik COD berbasis Leaflet.js & OpenStreetMap.
   - **Fitur GPS & Rute WA:** Pengambilan lokasi otomatis via GPS HP dan pembuatan rute jalan kaki langsung terhubung ke WhatsApp / Google Maps.
   - **Floating Navigasi Alwi:** Panel navigasi mengambang (*floating widget*) dengan efek suara Web Audio API untuk berpindah antarmodul peta.

---

## 📁 Struktur Berkas Kode

```text
.
├── index.html        # Aplikasi Utama: Nur Creative Lab, Kalkulator, & Simulator Kuantum
├── nav_alwi.js       # Widget Navigasi Melayang (Pos Tengah Alwi) + Web Audio Beep
├── peta-cod.html     # Peta COD Bebas 3 Titik (Leaflet.js + WhatsApp Route)
└── peta-cod22.html   # Peta COD khusus penentuan jarak dari Pos Tengah Awi ke Member
```

---

## 🧩 Penjelasan Komponen & Modul

### 1. Nur System App (`index.html`)
Aplikasi web utama dengan desain bertema emas-hitam bergaya Batik Digital:
- **Tab ⚡ Nur Lab:** Sarana pembuatan web/HTML otomatis melalui instruksi AI, dilengkapi fitur *Keep Notes* dan *Audio Voice*.
- **Tab 🧮 Kalkulator:** Kalkulator berbasis JS murni dengan UI kustom.
- **Tab ⚛️ Kuantum:** Engine simulasi kuantum 2-qubit yang menghitung amplitudo State Vector egin{pmatrix} a & b & c & d \end{pmatrix}^T$ secara riil dari gerbang $H$, $X$, dan $CNOT$.

### 2. Peta COD 3 Titik (`peta-cod.html`)
Fitur pemilihan lokasi COD hingga 3 titik acak:
- Menghitung garis antar-titik secara *polyline*.
- Mengirimkan link navigasi rute lengkap (*origin, destination, waypoints*) langsung ke pesan chat WhatsApp.

### 3. Pos Tengah Awi (`peta-cod22.html`)
Peta penentu titik acuan pusat (Pos Tengah Awi) terhadap posisi member:
- Memudahkan koordinasi penjemputan paket COD di wilayah Indramayu.

### 4. Agen Navigasi Alwi (`nav_alwi.js`)
Script widget mandiri (*self-invoking function*):
- Dapat diinjeksikan ke halaman peta mana saja.
- Menampilkan tombol melayang ⛑️ untuk beralih aplikasi peta secara instan dengan efek suara sinyal audio (frequency sweep $587.33	ext{ Hz} 
ightarrow 880	ext{ Hz}$).

---

## 🚀 Panduan Penggunaan

1. **Jalankan Aplikasi:**
   Buka file `index.html` atau `peta-cod.html` menggunakan browser web modern (Chrome, Edge, Firefox, Safari).
2. **Set API Key Gemini (Opsional):**
   Pada tab *Nur Lab*, ganti mesin ke **Gemini** lalu masukkan *Gemini API Key* Anda untuk mengaktifkan pembuat kode berfitur penuh.
3. **Menggunakan Peta COD:**
   - Izinkan akses GPS pada browser HP/Komputer.
   - Tekan tombol **📍 Tambah Titik (GPS Saya)** atau ketuk langsung area peta.
   - Setelah minimal 2 titik terpilih, tekan **🟢 Kirim Rute ke WhatsApp**.

---

## 🛠️ Teknologi & Dependensi

- **Frontend:** HTML5, CSS3 (Variables, Flexbox, Grid, CSS Paged Media), JavaScript ES6+
- **Mapping Framework:** [Leaflet.js](https://leafletjs.com/) v1.9.4 & OpenStreetMap
- **Web APIs Used:**
  - `Geolocation API` (Pelacakan Lokasi)
  - `Web Audio API` (Efek suara nada panggil)
  - `Web Speech API` (Pengucapan suara Bahasa Indonesia)
  - `LocalStorage API` (Penyimpanan memori & Keep notes)
