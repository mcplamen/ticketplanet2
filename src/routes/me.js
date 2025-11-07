// src/routes/me.js
import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import prisma from "../prismaClient.js";

const router = express.Router();

/**
 * GET /me
 * Returns user data from the token
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, createdAt: true }
    });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
