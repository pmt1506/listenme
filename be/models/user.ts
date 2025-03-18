import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  avatar: string;
  joinedDate: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  joinedDate: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
