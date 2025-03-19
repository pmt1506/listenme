import bcrypt from "bcrypt";
import { ICreateAccount } from "../models/account";
import Account from "../models/account";
import User from "../models/user";
import { DEFAULT_AVATAR_URL } from "../config/constants";

export const getAllAccounts = async () => {
  try {
    const accounts = await Account.find()
      .select("id username email user")
      .populate("user", "name avatar joinedDate");
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

  const existingAccount = await Account.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (existingAccount) {
    if (existingAccount.username === username) {
      throw new Error("Tên đăng nhập đã tồn tại");
    }
    if (existingAccount.email === email) {
      throw new Error("Email đã tồn tại");
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create User document
  const newUser = new User({
    name: username,
    avatar: DEFAULT_AVATAR_URL,
  });

  await newUser.save();

  // Create Account document
  const newAccount = new Account({
    username,
    email,
    password: hashedPassword,
    user: newUser._id,
    provider: "local"
  });

  await newAccount.save();

  return await newAccount.populate("user", "name avatar joinedDate");
};

export const findAccountByEmailOrUsername = async (
  email?: string,
  username?: string
) => {
  const account = await Account.findOne({
    $or: [{ email: email }, { username: username }],
  });

  if (!account) {
    throw new Error(
      "Không tìm thấy tài khoản với email hoặc tên đăng nhập này"
    );
  }
  return account;
};

export const findAccountByEmail = async (email: string) => {
  const account = await Account.findOne({ email }).populate("user");
  if (!account) {
    throw new Error("Không tìm thấy tài khoản với email này");
  }
  return account;
};

export const createAccountFromGoogle = async ({
  username,
  email,
  displayName,
  avatar,
}: {
  username: string;
  email: string;
  displayName: string;
  avatar: string;
}) => {
  const existingAccount = await Account.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (existingAccount) {
    return existingAccount;
  }
  const newUser = await User.create({
    name: displayName,
    avatar: avatar || DEFAULT_AVATAR_URL,
  });
  const account = await Account.create({
    username,
    email,
    password: "",
    user: newUser._id,
    provider: "google",
  });
  return account;
};
