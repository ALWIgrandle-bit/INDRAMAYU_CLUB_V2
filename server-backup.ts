import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import chokidar from "chokidar";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(process.cwd(), "uploads");
const renderDir = path.join(process.cwd(), "render");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(renderDir)) fs.mkdirSync(renderDir, { recursive: true });

// ==========================================
// CEK KETERSEDIAAN FFMPEG SEKALI DI AWAL
// (biar gak nunggu upload dulu baru ketahuan ffmpeg belum terpasang)
// ==========================================
let ffmpegAvailable = false;
exec("ffmpeg -version", (error) => {
  ffmpegAvailable = !error;
  if (!error) {
    console.log("✅ FFmpeg terdeteksi — auto-render foto ke video aktif.");
  } else {
    console.warn("⚠️  FFmpeg TIDAK ditemukan. Auto-render foto→video akan dilewati.");
    console.warn("    Pasang dulu lewat: pkg install ffmpeg   (di Termux)");
  }
});

// ==========================================
// DAFTAR TOOL HTML — dipindai otomatis dari folder project
// supaya hub/gerbang bisa nampilin daftar tool yang beneran ada
// ==========================================
const HIDDEN_FILES = new Set(["index.html"]); // jangan didobel di daftar kalau index.html memang hub-nya sendiri

function scanHtmlTools() {
  try {
    return fs
      .readdirSync(process.cwd())
      .filter((f) => f.toLowerCase().endsWith(".html"))
      .filter((f) => !HIDDEN_FILES.has(f))
      .sort();
  } catch (e) {
    console.error("Gagal memindai tool HTML:", e);
    return [];
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // maks 25MB per foto
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Hanya file gambar yang diterima."));
    }
    cb(null, true);
  },
});

function renderPhotoToVideo(filePath: string) {
  if (!ffmpegAvailable) {
    console.warn(`Lewati render "${path.basename(filePath)}" — FFmpeg belum terpasang.`);
    return;
  }
  const fileName = path.basename(filePath);
  const outputPath = path.join(renderDir, fileName.replace(/(\.[\w\d_-]+)$/i, "-rendered.mp4"));

  console.log(`🎬 Foto baru terdeteksi: ${fileName}. Nur mulai meracik makrifat...`);

  const cmd = `ffmpeg -y -loop 1 -i "${filePath}" -t 5 -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${outputPath}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Gagal render ${fileName}: ${error.message}`);
    } else {
      console.log(`✅ Rendered: ${path.basename(outputPath)}`);
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Melayani semua file statis (HTML, JS, CSS) dari folder utama project
  app.use(express.static(process.cwd()));

  // ✅ FIX: Static route untuk akses video hasil render langsung via /render/namafile.mp4
  app.use('/render', express.static(renderDir));

  // ✅ FIX: Static route untuk akses foto upload langsung via /uploads/namafile
  app.use('/uploads', express.static(uploadDir));

  // ---------- MANIFEST TOOL — dipakai hub/gerbang untuk nampilin daftar tool ----------
  app.get("/api/tools", (req, res) => {
    res.json({ tools: scanHtmlTools() });
  });

  // ---------- STATUS SERVER (buat cek cepat dari HP: ffmpeg jalan atau nggak) ----------
  app.get("/api/status", (req, res) => {
    res.json({
      status: "ok",
      ffmpegAvailable,
      uploadDir: "uploads/",
      renderDir: "render/",
      time: new Date().toISOString(),
    });
  });

  // ---------- UPLOAD FOTO ----------
  app.post("/api/upload", upload.array("photos", 15), (req, res) => {
    const files = (req.files as Express.Multer.File[]) || [];
    if (!files.length) {
      return res.status(400).json({ error: "Tidak ada foto yang diterima." });
    }
    res.json({
      message: ffmpegAvailable
        ? "Foto diterima Nur, proses render otomatis bayangan dimulai!"
        : "Foto diterima Nur, tapi FFmpeg belum aktif jadi belum dirender ke video.",
      files: files.map((f) => f.filename),
    });
  });

  // ---------- DAFTAR FILE YANG SUDAH DIUPLOAD ----------
  app.get("/api/files", (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
      if (err) return res.status(500).json({ error: "Gagal membaca folder uploads." });
      res.json(files);
    });
  });

  // ---------- DAFTAR HASIL RENDER (video) — hanya .mp4 ✅ ----------
  app.get("/api/renders", (req, res) => {
    fs.readdir(renderDir, (err, files) => {
      if (err) return res.status(500).json({ error: "Gagal membaca folder render." });
      // Filter hanya .mp4 agar dropdown tidak terisi file sampah
      const mp4Only = files.filter(f => f.toLowerCase().endsWith('.mp4'));
      res.json(mp4Only);
    });
  });

  // ---------- AMBIL SATU FILE UPLOAD (dengan token opsional) ----------
  app.get("/api/file/:filename", (req, res) => {
    const token = req.query.token;
    if (process.env.FILE_ACCESS_TOKEN && token !== process.env.FILE_ACCESS_TOKEN) {
      return res.status(403).send("Forbidden");
    }
    const filePath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send("Not Found");
    }
  });

  // ---------- AMBIL SATU HASIL RENDER (video) ----------
  app.get("/api/render/:filename", (req, res) => {
    const token = req.query.token;
    if (process.env.FILE_ACCESS_TOKEN && token !== process.env.FILE_ACCESS_TOKEN) {
      return res.status(403).send("Forbidden");
    }
    const filePath = path.join(renderDir, req.params.filename);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send("Not Found");
    }
  });

  // ---------- WATCHER — otomatis render tiap ada foto baru masuk folder uploads ----------
  const watcher = chokidar.watch(uploadDir, { persistent: true, ignoreInitial: true });
  watcher.on("add", (filePath) => {
    if (filePath.endsWith("-rendered.mp4")) return;
    renderPhotoToVideo(filePath);
  });
  watcher.on("error", (err) => console.error("Watcher error:", err));

  // ---------- 404 HANDLER (rapi, bukan HTML default Express) ----------
  app.use((req, res) => {
    res.status(404).json({ error: "Rute tidak ditemukan.", path: req.path });
  });

  // ---------- ERROR HANDLER GLOBAL (termasuk error dari multer) ----------
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Server error:", err.message);
    res.status(500).json({ error: err.message || "Terjadi kesalahan di server." });
  });

  app.listen(PORT, () => {
    console.log(`⚡ Server Nur beroperasi di http://localhost:${PORT}`);
    console.log(`   Tool terdeteksi: ${scanHtmlTools().join(", ") || "(tidak ada file .html)"}`);
  });
}

startServer();


