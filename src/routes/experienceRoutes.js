

import express from "express";
import upload from "../middleware/upload.js";
import {
  createExperience,
  getAllExperiences,
  updateExperience,
  deleteExperience,
  getExperienceBySlug,
  getExperienceById
} from "../controller/Botswana/experienceController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 10 },
  { name: "highlightImages", maxCount: 10 },
  { name: "gameDriveImages", maxCount: 10 },
  { name: "includeIcons", maxCount: 20 },
]),  
createExperience
);

router.get("/", getAllExperiences);
router.get("/slug/:slug", getExperienceBySlug);

router.get("/:id", getExperienceById); // 👈 Required for frontend
router.put(
  "/:id",
  upload.fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 10 },
  { name: "highlightImages", maxCount: 10 },
  { name: "gameDriveImages", maxCount: 10 },
  { name: "includeIcons", maxCount: 20 },
]),
  updateExperience
);
router.delete("/:id", deleteExperience);

export default router;
