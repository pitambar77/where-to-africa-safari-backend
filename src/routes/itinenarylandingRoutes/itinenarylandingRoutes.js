import express from "express";
import upload from "../../middleware/upload.js";

import {
  createItinenarylanding,
  getAllItinenarylanding,
  getItinenarylandingById,
  updateItinenarylanding,
  deleteItinenarylanding,
} from "../../controller/ItinenarylandingController/itinenarylandingController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  createItinenarylanding,
);

router.get("/", getAllItinenarylanding);
router.get("/:id", getItinenarylandingById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  updateItinenarylanding,
);

router.delete("/:id", deleteItinenarylanding);

export default router;
