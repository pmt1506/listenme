import { configDotenv } from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

configDotenv();

interface JwtPayload {
  id: string;
  username: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Không tìm thấy access token!" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.id, username: decoded.username };
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
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ message: "Không tìm thấy refresh token!" });
    return;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET
    ) as JwtPayload;
    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Refresh token không hợp lệ hoặc đã hết hạn!" });
    return;
  }
};
