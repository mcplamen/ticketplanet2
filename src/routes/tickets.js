// src/routes/tickets.js
import express from "express";
import prisma from "../prismaClient.js";
import { createGooglePass } from "../services/google-wallet.js";

const router = express.Router();

const API_KEY = process.env.API_KEY || "change_this_api_key_for_powermail";

router.post("/generate-ticket", async (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers.authorization;

    // проверка за Bearer токен или x-api-key
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const jwt = await import("jsonwebtoken");
      try {
        const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        userId = decoded.id;
      } catch {
        return res.status(401).json({ success: false, error: "Invalid token" });
      }
    } else if (req.headers["x-api-key"] && req.headers["x-api-key"] === API_KEY) {
      userId = null; // Powermail достъп
    } else {
      return res.status(401).json({ success: false, error: "Unauthorized. Provide Bearer token or x-api-key" });
    }

    const { name, phone, email, eventId } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, error: "Missing required fields" });

    // създаваме Google билет
    const gw = await createGooglePass({ name, phone, email });
    if (!gw.success) return res.status(500).json({ success: false, error: gw.error });

    // запис в БД (ако има eventId)
    let ticketRecord = null;
    if (eventId) {
      ticketRecord = await prisma.ticket.create({
        data: {
          objectId: gw.objectId,
          saveUrl: gw.saveUrl,
          eventId: eventId,
          ownerId: userId || undefined,
        },
      });
    }

    return res.json({
      success: true,
      message: "Ticket created successfully",
      saveUrl: gw.saveUrl,
      objectId: gw.objectId,
      ticket: ticketRecord,
    });
  } catch (err) {
    console.error("❌ Ticket generation error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
