// backend/src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import uploadRoutes from "./routes/upload.js";
import authRoutes from "./routes/auth.js";
import eventsRoutes from "./routes/events.js"; // ако имаш събития

// Зареждане на .env от главната директория
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Инициализация на Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Статични файлове (ако искаш достъп до качени файлове през /uploads)
app.use("/uploads", express.static(path.resolve(__dirname, "../../uploads")));

// Роутове
app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/events", eventsRoutes); // по желание, ако имаш

// Главен тестов маршрут
app.get("/", (req, res) => {
  res.send("✅ TicketPlanet backend is running...");
});

// Стартиране на сървъра
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
