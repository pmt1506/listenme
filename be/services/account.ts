import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { ICreateAccount } from "../models/account";
import { DEFAULT_AVATAR_URL } from "../config/constants";

export const getAllAccounts = async () => {
  try {
    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        user: true,
      },
    });
    if (!accounts) {
      throw new Error("Không tìm thấy danh sách tài khoản");
    }
    return accounts;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tài khoản:", error);
    throw new Error("Không thể lấy danh sách tài khoản");
  }
};

export const createAccount = async (data: ICreateAccount) => {
  const { username, password, confirmPassword, email } = data;

  if (!username || !password || !email) {
    throw new Error("Các trường bắt buộc không được để trống");
  }
  if (password !== confirmPassword) {
    throw new Error("Mật khẩu và xác nhận mật khẩu không khớp");
  }

  const existingAccount = await prisma.account.findFirst({
    where: {
      OR: [{ username: username }, { email: email }],
    },
  });

  if (existingAccount) {
    if (existingAccount.username === username) {
      throw new Error("Tên đăng nhập đã tồn tại");
    }
    if (existingAccount.email === email) {
      throw new Error("Email đã tồn tại");
    }
  }

  const newPassword = await bcrypt.hash(password, 10);
  const newAccount = await prisma.account.create({
    data: {
      username,
      password: newPassword,
      email,
      user: {
        create: {
          name: username,
          avatar: DEFAULT_AVATAR_URL,
        },
      },
    },
  });

  return newAccount;
};

export const findAccountByEmailOrUsername = async (
  email: string,
  username: string
) => {
  const account = await prisma.account.findFirst({
    where: {
      OR: [{ email: email }, { username: username }],
    },
  });
  if (!account) {
    throw new Error(
      "Không tìm thấy tài khoản với email hoặc tên đăng nhập này"
    );
  }
  return account;
};
