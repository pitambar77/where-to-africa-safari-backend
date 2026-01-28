
import express from "express";
import upload from "../../middleware/upload.js";
import {
  createExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  deleteGalleryImage,
  deleteHighlightImage,
  deleteGameDriveImage,

} from "../../controller/experienceController/experienceController.js";


const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 20 },
    { name: "gameDriveImages", maxCount: 20 },
    { name: "highlightImages", maxCount: 20 },
  ]),
  createExperience
);

router.patch(
  "/:id",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 20 },
    { name: "gameDriveImages", maxCount: 20 },
    { name: "highlightImages", maxCount: 20 },
  ]),
  updateExperience
);

router.get("/", getAllExperiences);
router.get("/:id", getExperienceById);
router.delete("/:id", deleteExperience);
router.delete("/:id/gallery/:imageId", deleteGalleryImage);
router.delete("/:id/highlight/:highlightId", deleteHighlightImage);
router.delete("/:id/gameDrive/:driveId", deleteGameDriveImage);



export default router;

