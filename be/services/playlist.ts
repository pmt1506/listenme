import { ICreatePlaylist } from "../models/playlist";
import Playlist from "../models/playlist";

export const createNewPlaylist = async (data: ICreatePlaylist) => {
  try {
    const newPlaylist = new Playlist(data);
    await newPlaylist.save();
    return newPlaylist;
  } catch (error) {
    console.error(error);
    throw new Error("Tạo playlist thất bại");
  }
};
