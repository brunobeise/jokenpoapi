import { NextFunction, Request, Response } from "express";

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const admpass = req.headers.admpass;
  if (admpass !== process.env.ADMPASS) {
    res.json({ message: "Unauthorized" });
    return;
  }
  next();
}
