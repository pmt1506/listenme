import axios from "axios";
import { configDotenv } from "dotenv";

configDotenv()

export const fetchTrendingTracks = async () => {
  const token = await getAppAccessToken(); // App token, NOT user token
  const response = await axios.get(
    "https://api.spotify.com/v1/browse/new-releases",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

async function getAppAccessToken() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
  const authBuffer = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");
  
  const res = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: { Authorization: `Basic ${authBuffer}` },
    }
  );
  return res.data.access_token;
}
