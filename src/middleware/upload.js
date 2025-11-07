import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.resolve("uploads/events");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadPath),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + ext;
    cb(null, name);
  },
});

export const upload = multer({ storage });
