import mongoose, { Schema } from "mongoose";
import { IUser } from "./user";

export interface IPlaylist extends Document {
  name: string;
  description: string;
  user: mongoose.Types.ObjectId | IUser;
  tracks: mongoose.Types.ObjectId[]; // Referencing track documents
}

const PlaylistSchema = new Schema<IPlaylist>({
  name: { type: String, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
});

export default mongoose.model<IPlaylist>("Playlist", PlaylistSchema);