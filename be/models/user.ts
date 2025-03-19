import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  avatar: string;
  joinedDate: Date;
  spotify?: {
    id: string;
    displayName: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  joinedDate: { type: Date, default: Date.now },
  spotify: {
    id: { type: String },
    displayName: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    expiresAt: { type: Number }, // timestamp in ms
  },
});

export default mongoose.model<IUser>("User", UserSchema);
