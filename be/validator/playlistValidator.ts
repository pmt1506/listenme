import { body } from "express-validator";

export const createPlaylistValidator = [
  body("name")
    .notEmpty()
    .withMessage("Tên playlist không được để trống")
    .isString()
    .withMessage("Tên playlist phải là chuỗi"),
  
  body("description")
    .optional()
    .isString()
    .withMessage("Mô tả phải là chuỗi"),
];
