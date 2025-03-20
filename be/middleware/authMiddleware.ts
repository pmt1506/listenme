import { configDotenv } from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyAccessToken as verifyAccessTokenUtils } from "../utils/jwt";

configDotenv();

interface JwtPayload {
  id: string;
  username: string;
  userId: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(401).json({ message: "Không tìm thấy access token!" });
  }

  try {
    const decoded = verifyAccessTokenUtils(token) as JwtPayload;
    req.user = {
      id: decoded.id,
      username: decoded.username,
      userId: decoded.userId,
    };
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Access token không hợp lệ hoặc đã hết hạn!" });
    return;
  }
};

export const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "Không tìm thấy refresh token!" });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload;
    req.user = {
      id: decoded.id,
      username: decoded.username,
      userId: decoded.userId,
    };
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Refresh token không hợp lệ hoặc đã hết hạn!" });
    return;
  }
};
