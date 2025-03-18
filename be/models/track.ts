import mongoose, { Schema } from "mongoose";

export interface ITrack extends Document {
    title: string;
    artist: string;
    source: 'spotify' | 'youtube';
    sourceId: string; // Spotify ID or YouTube video ID
    duration: number; // In seconds
    thumbnail: string;
  }
  
  const TrackSchema = new Schema<ITrack>({
    title: { type: String, required: true },
    artist: { type: String },
    source: { type: String, enum: ['spotify', 'youtube'], required: true },
    sourceId: { type: String, required: true },
    duration: { type: Number },
    thumbnail: { type: String },
  });
  
  export default mongoose.model<ITrack>("Track", TrackSchema);