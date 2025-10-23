import prisma from "../prismaClient.js";

export const createEvent = async (req, res) => {
  const { title, description, date, location, logoPath } = req.body;
  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: date ? new Date(date) : null,
        logoPath,
        ownerId: req.user.id,
      },
    });
    res.json({ success: true, event });
  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { ownerId: req.user.id },
      include: { tickets: true },
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
