import { Router } from "express";
import {
  createAccount,
  getAllAccounts,
  requestEmailUpdate,
  updateEmail,
  updatePassword,
} from "../services/account";
import {
  createAccountValidator,
  updateEmailValidator,
  changePasswordValidator,
} from "../validator/accountValidator";
import { matchedData, validationResult } from "express-validator";
import { ICreateAccount } from "../models/account";
import { verifyAccessToken } from "../middleware/authMiddleware";
import { sendWelcomeEmail } from "../services/mailer";

const router = Router();

router.get("/", async (req: any, res: any): Promise<any> => {
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

router.post("/request-otp", verifyAccessToken, async (req: any, res: any) => {
  const id = req.user.id;

  try {
    const result = await requestEmailUpdate(id);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.patch(
  "/change-email",
  verifyAccessToken,
  updateEmailValidator,
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.user.id;

    const { newEmail, otp } = matchedData(req);

    try {
      const result = await updateEmail(id, newEmail, otp);
      if (result) {
        return res.status(200).json({ message: "Cập nhật email thành công" });
      }
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
);

router.put(
  "/change-password",
  verifyAccessToken,
  changePasswordValidator,
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.user.id;

    const { password, confirmPassword } = matchedData(req);

    try {
      const result = await updatePassword(id, password, confirmPassword);
      if (result) {
        return res
          .status(200)
          .json({ message: "Cập nhật mật khẩu thành công" });
      }
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
);

export default router;
