import { IsString } from "class-validator";

export interface IAccount {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface ICreateAccount {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUpdateAccount {
  email?: string;
  password?: string;
  confirmPassword?: string;
}
