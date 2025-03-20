import User from "../models/user";

export const updateAvatar = async (userId: string, avatar: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }
    user.avatar = avatar;
    await user.save();
  } catch (error: any) {
    throw new Error(error.message);
  }
};
