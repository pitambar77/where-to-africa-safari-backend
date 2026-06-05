import express from "express";
import upload from "../../middleware/upload.js";

import {
  createExperiencelanding,
  getAllExperiencelanding,
  getExperiencelandingById,
  updateExperiencelanding,
  deleteExperiencelanding,
} from "../../controller/experiencelandingController/experiencelandingController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  createExperiencelanding,
);

router.get("/", getAllExperiencelanding);
router.get("/:id", getExperiencelandingById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  updateExperiencelanding,
);

router.delete("/:id", deleteExperiencelanding);

export default router;
