import { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();

const jwt = require("jsonwebtoken");

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Obtenha o token JWT da requisição
  const token = req.headers.authorization;
  if (!token) {
    res.json("Invalid JWT token");
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    if (!decoded) throw new Error("Invalid JWT token");
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
