import { Router } from "express";
import {
  createAccount,
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

/**
 * @openapi
 * /account/create:
 *   post:
 *     summary: Tạo tài khoản mới
 *     tags:
 *       - Account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 */
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

/**
 * @openapi
 * /account/request-otp:
 *   post:
 *     summary: Gửi OTP về email của tài khoản
 *     tags:
 *       - Account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP đã được gửi
 *       400:
 *         description: Lỗi không hợp lệ
 */
router.post("/request-otp", verifyAccessToken, async (req: any, res: any) => {
  const id = req.user.id;
  try {
    const result = await requestEmailUpdate(id);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * @openapi
 * /account/change-email:
 *   patch:
 *     summary: Cập nhật email mới
 *     tags:
 *       - Account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newEmail
 *               - otp
 *             properties:
 *               newEmail:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật email thành công
 *       400:
 *         description: Lỗi OTP hoặc email không hợp lệ
 */
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

/**
 * @openapi
 * /account/change-password:
 *   put:
 *     summary: Cập nhật mật khẩu
 *     tags:
 *       - Account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật mật khẩu thành công
 *       400:
 *         description: Lỗi xác thực hoặc dữ liệu đầu vào
 */
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
