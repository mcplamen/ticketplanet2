// src/routes/tickets.js
import express from "express";
import prisma from "../prismaClient.js";
import { createGooglePass } from "../services/google-wallet.js";
import QRCode from "qrcode";
import { generateTicketPDF } from "../services/pdfTicketService.js";
import path from "path";
import fs from "fs";


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

router.post("/generate", authMiddleware, async (req, res) => {
  const { eventId } = req.body;

  const ticket = await prisma.ticket.create({
    data: {
      eventId,
      ownerId: req.user.id
    }
  });

  const qrData = `http://localhost:3000/tickets/validate/${ticket.id}`;
  const qrImage = await QRCode.toDataURL(qrData);

  res.json({ ticket, qr: qrImage });
});

router.get("/validate/:ticketId", async (req, res) => {
  const { ticketId } = req.params;

  const ticket = await prisma.ticket.findUnique({
    where: { id: Number(ticketId) },
    include: { event: true, owner: true }
  });

  if (!ticket) return res.status(404).json({ valid: false });

  res.json({
    valid: true,
    event: ticket.event.title,
    owner: ticket.owner.email
  });
});

router.get("/download/:ticketId", authMiddleware, async (req, res) => {
  const { ticketId } = req.params;

  const ticket = await prisma.ticket.findUnique({
    where: { id: Number(ticketId) },
    include: { event: true, owner: true }
  });

  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  if (ticket.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  const pdfPath = await generateTicketPDF(ticket, ticket.event, ticket.owner);

  res.download(pdfPath);
});


export default router;
