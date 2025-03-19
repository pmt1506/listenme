import { Router } from "express";
import {
  fetchNewReleases,
  fetchTrendingTracks,
} from "../services/spotifyPublic";

const router = Router();

router.get("/trending", async (req, res): Promise<void> => {
  try {
    const response = await fetchTrendingTracks();
    if (response)
      res.status(200).json({
        message: "Tìm thấy dữ liệu thành công",
        data: response,
      });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/new-releases", async (req, res): Promise<void> => {
  try {
    const response = await fetchNewReleases();
    if (response)
      res.status(200).json({
        message: "Tìm thấy dữ liệu thành công",
        data: response,
      });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
