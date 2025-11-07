// src/routes/events.js
import express from "express";
import prisma from "../prismaClient.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";


const router = express.Router();

// ✅ Protected Create Event
router.post("/create", authMiddleware, upload.single("logo"), async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        ownerId: req.user.id,
        logoPath: req.file ? `/uploads/events/${req.file.filename}` : null,
      }
    });

    res.json(event);
  } catch (error) {
    console.error("❌ Error creating event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Edit Event (only event owner can edit)
router.put("/:id", authMiddleware, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const { title, description, date, logoPath } = req.body;

  try {
    // Проверяваме дали event-а съществува и дали user е owner
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized – not event owner" });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        date: date ? new Date(date) : null,
        logoPath: logoPath || null,
      },
    });

    res.json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("❌ Error updating event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete Event (only event owner can delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  const eventId = parseInt(req.params.id);

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized – not event owner" });
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting event:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Get only events owned by logged user
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    res.json(events);
  } catch (error) {
    console.error("❌ Error fetching my events:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
