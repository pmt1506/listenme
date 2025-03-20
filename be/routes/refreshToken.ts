import { Request, Response } from "express";
import { signAccessToken, verifyRefreshToken } from "../utils/jwt";
import axios from "axios";
import { configDotenv } from "dotenv";

configDotenv();

export const handleRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "Không tìm thấy refresh token!" });
    }

    const decoded: any = verifyRefreshToken(refreshToken);

    // Create new access token
    const newAccessToken = signAccessToken({
      id: decoded.id,
      username: decoded.username,
      userId: decoded.userId,
    });

    res.status(200).json({
      accessToken: newAccessToken,
      message: "Làm mới access token thành công",
    });
    return;
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi làm mới access token" });
    return;
  }
};

export const refreshSpotifyToken = async (refreshToken: string) => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    params,
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
            "base64"
          ),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return {
    accessToken: response.data.access_token,
    expiresIn: response.data.expires_in,
  };
};
