import express from "express";
import {
  getSitemapData,
} from "../controller/sitemapController.js";

const router = express.Router();

router.get("/", getSitemapData);

export default router;