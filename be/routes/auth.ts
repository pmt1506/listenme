import { matchedData, validationResult } from "express-validator";
import { verifyRefreshToken } from "../middleware/authMiddleware";
import { handleRefreshToken } from "./refreshToken";
import { Router } from "express";
import bcrypt from "bcrypt";
import { loginValidator } from "../validator/accountValidator";
import { findAccountByEmailOrUsername } from "../services/account";
import { signAccessToken, signRefreshToken } from "../utils/jwt";

const router = Router();

router.post("/login", loginValidator, async (req: any, res: any) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  const { identity, password } = matchedData(req);

  try {
    const isEmail = identity.includes("@");

    const existedAccount = await findAccountByEmailOrUsername(
      isEmail ? identity : undefined,
      !isEmail ? identity : undefined
    );

    if (!existedAccount) {
      return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    }
    if (!(await bcrypt.compare(password, existedAccount.password!))) {
      return res.status(400).json({ message: "Mật khẩu không đúng!" });
    }
    const accessToken = signAccessToken({
      id: existedAccount.id,
      username: existedAccount.username,
      userId: existedAccount.user._id,
    });
    const refreshToken = signRefreshToken({
      id: existedAccount.id,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        path: "/auth/refresh", // restrict refresh token usage only to this endpoint
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "Đăng nhập thành công!",
      });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
});

router.post("/refresh", verifyRefreshToken, handleRefreshToken);

router.post("/logout", (req: any, res: any) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/auth/refresh",
  });

  return res.status(200).json({ message: "Đăng xuất thành công!" });
});

export default router;
