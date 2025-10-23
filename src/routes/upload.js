// src/routes/upload.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 📂 Къде ще се пазят файловете (по подразбиране ./uploads)
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

// Уверяваме се, че папката съществува
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ⚙️ Настройки на Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeName =
      base.replace(/[^a-zA-Z0-9_-]/g, "_") + "_" + Date.now() + ext;
    cb(null, safeName);
  },
});

const upload = multer({ storage });

// 📤 Качване на един файл (потребителят трябва да е логнат)
router.post("/", authMiddleware, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    // Пълен път до качения файл
    const filePath = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: "✅ File uploaded successfully",
      path: filePath,
      originalName: req.file.originalname,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      success: false,
      error: "Server error during upload",
    });
  }
});

export default router;
