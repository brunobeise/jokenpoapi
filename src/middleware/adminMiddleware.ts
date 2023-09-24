import { NextFunction, Request, Response } from "express";

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const admpass = req.headers.admpass;
  if (admpass !== process.env.ADMPASS) {
    res.status(401).send("Unauthorized");
    return;
  }
  next();
}
