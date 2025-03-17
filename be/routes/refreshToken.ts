import { Request, Response } from "express";
import { signAccessToken } from "../utils/jwt";


export const handleRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(400).json({ message: "Không tìm thấy thông tin người dùng!" });
      return;
    }

    // Create new access token
    const newAccessToken = signAccessToken({
      id: user.id,
      username: user.username,
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
