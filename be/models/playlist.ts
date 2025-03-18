import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';

export interface IPlaylist extends Document {
  name: string;
  description: string;
  user: mongoose.Types.ObjectId | IUser;
}

const PlaylistSchema = new Schema<IPlaylist>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
