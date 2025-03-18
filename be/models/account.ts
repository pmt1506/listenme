import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user";

export interface ICreateAccount extends Document {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IAccount extends Document {
  username: string;
  email: string;
  password?: string;
  provider: "local" | "google";
  user: mongoose.Types.ObjectId | IUser;
}

const AccountSchema = new Schema<IAccount>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for OAuth
  provider: { type: String, enum: ["local", "google"], default: "local" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IAccount>("Account", AccountSchema);
