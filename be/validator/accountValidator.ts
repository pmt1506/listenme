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
    .isLength({ min: 1 })
    .withMessage("Tài khoản phải có ít nhất 6 ký tự")
    .bail()
    .isString()
    .withMessage("Tài khoản không hợp lệ"),
  body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
];
