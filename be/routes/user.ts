import { Router, Request, Response } from "express";
import { upload } from "../utils/multer";
import User from "../models/user";
import { verifyAccessToken } from "../middleware/authMiddleware";
import cloudinary, {
  extractPublicId,
  uploadToCloudinary,
} from "../utils/cloudinary";

const router = Router();

router.patch(
  "/change-avatar",
  verifyAccessToken,
  upload.single("avatar"),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.user!.userId;
      if (!userId) {
        return res.status(400).json({ message: "Thiếu userId" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Không có file nào được upload" });
      }

      const result: any = await uploadToCloudinary(req.file.buffer);

      // Optional: delete old avatar from Cloudinary (if stored as a Cloudinary URL)
      if (user.avatar && user.avatar.includes("res.cloudinary.com")) {
        const publicId = extractPublicId(user.avatar);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Update user document
      user.avatar = result.secure_url;
      await user.save();

      return res.status(200).json({
        message: "Đã cập nhật avatar thành công!",
        avatarUrl: result.secure_url,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Lỗi server" });
    }
  }
);

export default router;
