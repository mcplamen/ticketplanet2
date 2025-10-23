import express from "express";
import { createEvent, getMyEvents } from "../controllers/eventController.js";
import requireAuth from "../middleware/authMiddleware.js"; // ✅ правилен импорт
import prisma from "../prismaClient.js";

const router = express.Router();

// ✅ Използваме "requireAuth", а не "authMiddleware"
router.post("/", requireAuth, createEvent);
router.get("/mine", requireAuth, getMyEvents);

export default router;
