import express from "express";
import upload from "../../middleware/upload.js";

import {
  createAccommodationlanding,
  getAllAccommodationlanding,
  getAccommodationlandingById,
  updateAccommodationlanding,
  deleteAccommodationlanding,
} from "../../controller/accommodationlandingController/accommodationlandingController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  createAccommodationlanding,
);

router.get("/", getAllAccommodationlanding);
router.get("/:id", getAccommodationlandingById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  updateAccommodationlanding,
);

router.delete("/:id", deleteAccommodationlanding);

export default router;
