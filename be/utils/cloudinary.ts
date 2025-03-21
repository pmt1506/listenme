import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";

configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadAvatarCloudinary = async (fileBuffer: Buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "avatars" }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      })
      .end(fileBuffer);
  });
};

export const uploadPlaylistCoverCloudinary = async (fileBuffer: Buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
     .upload_stream({ folder: "playlist-covers" }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      })
     .end(fileBuffer);
  });
}

export const extractPublicId = (url: string) => {
  const parts = url.split("/");
  const publicIdWithExtension = parts[parts.length - 1];
  const [publicId] = publicIdWithExtension.split(".");
  return `avatars/${publicId}`;
};


export default cloudinary;
