import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import {
  createAccount,
  findAccountByEmailOrUsername,
  getAllAccounts,
} from "../services/account";
import {
  createAccountValidator,
  loginValidator,
} from "../validator/accountValidator";
import { matchedData, validationResult } from "express-validator";
import { ICreateAccount } from "../models/account";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { verifyRefreshToken } from "../middleware/authMiddleware";
import { handleRefreshToken } from "./refreshToken";
import { sendWelcomeEmail } from "../utils/mailer";

const router = Router();

router.get("/", async (req, res): Promise<any> => {
  try {
    const accounts = await getAllAccounts();
    if (!accounts || accounts.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh sách tài khoản" });
    }
    return res.status(200).json(accounts);
  } catch (err: any) {
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

router.post("/create", createAccountValidator, async (req: any, res: any) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req) as ICreateAccount;

  try {
    const newAccount = await createAccount(data);
    if (newAccount) {
      sendWelcomeEmail(newAccount.email, newAccount.username);
      return res
        .status(201)
        .json({ message: "Tạo tài khoản thành công!", data: newAccount });
    }
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

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
      userId: existedAccount.user._id
    });
    const refreshToken = signRefreshToken({
      id: existedAccount.id,
    });
    return res.status(200).json({
      message: "Đăng nhập thành công",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
});

router.post("/refresh", verifyRefreshToken, handleRefreshToken);

export default router;
