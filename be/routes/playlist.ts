import { Router } from "express";
import { createNewPlaylist } from "../services/playlist";
import { createPlaylistValidator } from "../validator/playlistValidator";
import { matchedData, validationResult } from "express-validator";
import { ICreatePlaylist } from "../models/playlist";
import { verifyAccessToken } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/create",
  verifyAccessToken,
  createPlaylistValidator,
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req) as ICreatePlaylist;
  }
);

export default router;