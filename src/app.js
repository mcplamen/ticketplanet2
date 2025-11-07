// src/app.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";  // ✅ добавено

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);   // ✅ добавено
app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => res.send("API is running"));

app.listen(3000, () => console.log("Backend running at http://localhost:3000"));
