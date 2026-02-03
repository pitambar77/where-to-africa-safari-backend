// import express from "express";
// import upload from "../middleware/upload.js";
// import * as ctrl from "../controller/Botswana/experienceController.js";

// const router = express.Router();

// router.post("/", upload.fields([
//   { name: "bannerImage", maxCount: 1 },
//   { name: "gallery", maxCount: 30 }
// ]), ctrl.createExperience);

// router.get("/", ctrl.getExperiences);
// router.get("/:id", ctrl.getExperienceById);
// router.put("/:id", upload.fields([
//   { name: "bannerImage", maxCount: 1 },
//   { name: "gallery", maxCount: 30 }
// ]), ctrl.updateExperience);
// router.delete("/:id", ctrl.deleteExperience);

// export default router;

// routes/experienceRoutes.js
// import express from "express";
// import upload from "../middleware/upload.js";
// import {
//   createExperience,
//   getAllExperiences,
//   getExperienceById,
//   updateExperience,
//   deleteExperience,
// } from "../controllers/experienceController.js";

// const router = express.Router();

// /**
//  * accepted files:
//  * - bannerImage (single)
//  * - galleryImages (multiple)
//  * - highlightsImages (multiple)
//  * - gameDriveImages (multiple)
//  *
//  * Pairing: When sending highlights/gameDrives arrays as JSON, send image files in the same order as the array.
//  */
// router.post(
//   "/",
//   upload.fields([
//     { name: "bannerImage", maxCount: 1 },
//     { name: "galleryImages", maxCount: 50 },
//     { name: "highlightsImages", maxCount: 50 },
//     { name: "gameDriveImages", maxCount: 50 },
//   ]),
//   createExperience
// );

// router.get("/", getAllExperiences);
// router.get("/:id", getExperienceById);
// router.put(
//   "/:id",
//   upload.fields([
//     { name: "bannerImage", maxCount: 1 },
//     { name: "galleryImages", maxCount: 50 },
//     { name: "highlightsImages", maxCount: 50 },
//     { name: "gameDriveImages", maxCount: 50 },
//   ]),
//   updateExperience
// );
// router.delete("/:id", deleteExperience);

// export default router;

import express from "express";
import upload from "../middleware/upload.js";
import {
  createExperience,
  getAllExperiences,
  updateExperience,
  deleteExperience,
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
