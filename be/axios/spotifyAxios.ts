import axios from "axios";
import redis from "../utils/redisClient";
import { configDotenv } from "dotenv";

configDotenv();

const instance = axios.create({
  baseURL: "https://api.spotify.com/v1/",
});

// Add interceptor to include token automatically
instance.interceptors.request.use(async (config) => {
  const cacheKey = "spotify_app_token";
  let token = await redis.get(cacheKey);

  if (!token) {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
    const authBuffer = Buffer.from(
      `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");

    const res = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: { Authorization: `Basic ${authBuffer}` },
      }
    );

    token = res.data.access_token;
    if (token) {
      await redis.set(cacheKey, token, "EX", 3600);
    }
  }

  if (config.headers) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

export default instance;
