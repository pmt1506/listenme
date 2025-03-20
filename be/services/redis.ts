import crypto from "crypto";
import redis from "../utils/redisClient";

export const generateOtp = async (accountId: string) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const key = `otp:${accountId}`;

  // Save OTP to Redis with 5 minutes expiry
  await redis.set(key, otp, "EX", 300); // 300 seconds = 5 minutes

  return otp;
};

export const verifyOtp = async (accountId: string, otp: string) => {
  const key = `otp:${accountId}`;
  const storedOtp = await redis.get(key);
  if (!storedOtp) {
    throw new Error("OTP đã hết hạn hoặc không tồn tại");
  }
  if (storedOtp !== otp) {
    throw new Error("OTP không hợp lệ");
  }
  await redis.del(key); // Delete OTP after verification
  return true;
};
