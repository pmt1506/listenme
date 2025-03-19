import { configDotenv } from "dotenv";
import spotifyAxios from "../axios/spotifyAxios";

configDotenv();

export const fetchTrendingTracks = async () => {
  const response = await spotifyAxios.get("browse/new-releases");
  return response.data;
};

export const fetchNewReleases = async () => {
  const response = await spotifyAxios.get("browse/new-releases");
  return response.data;
};
