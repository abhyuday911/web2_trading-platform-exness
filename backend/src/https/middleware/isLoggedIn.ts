import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const isLoggedIn = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "not authenticated" });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY as string);
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({ message: "invalid or expired token" });
  }
};
