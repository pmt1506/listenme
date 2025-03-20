import { body } from "express-validator";

export const createAccountValidator = [
  body("username")
    .notEmpty()
    .withMessage("Tài khoản không được để trống")
    .isLength({ min: 6 })
    .withMessage("Tài khoản phải có ít nhất 6 ký tự"),

  body("email")
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Mật khẩu xác nhận không được để trống")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Mật khẩu xác nhận không khớp"),
];

export const loginValidator = [
  body("identity")
    .notEmpty()
    .withMessage("Tài khoản (username/email) không được để trống")
    .bail()
    .isString()
    .withMessage("Tài khoản không hợp lệ"),
  body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
];

export const updateEmailValidator = [
  body("newEmail")
    .isEmail()
    .withMessage("Email mới không hợp lệ")
    .notEmpty()
    .withMessage("Email mới không được để trống"),
  body("otp")
    .notEmpty()
    .withMessage("OTP không được để trống"),
];
export const changePasswordValidator = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới phải có ít nhất 6 ký tự")
    .notEmpty()
    .withMessage("Mật khẩu mới không được để trống"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Xác nhận mật khẩu không được để trống"),
];
