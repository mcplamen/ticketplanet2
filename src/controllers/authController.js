// src/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_jwt_secret";
const TOKEN_EXPIRES_IN = "7d";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(409).json({ success: false, message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hash }
    });

    const { password: _pw, ...safeUser } = user;
    return res.status(201).json({ success: true, user: safeUser });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    );

    const { password: _pw, ...safeUser } = user;
    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
