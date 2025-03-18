import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user";

export interface IAccount extends Document {
  username: string;
  email: string;
  password: string;
  user: mongoose.Types.ObjectId | IUser;
}

export interface ICreateAccount extends Document {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AccountSchema = new Schema<IAccount>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IAccount>("Account", AccountSchema);
