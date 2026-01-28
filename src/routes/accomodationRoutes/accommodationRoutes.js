import express from "express";
import upload from "../../middleware/upload.js";
import {
  createAccommodation,
  getAccommodations,
  // getAllAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
} from "../../controller/accomodationController/accommodationController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "bannerImages", maxCount: 5 },
    { name: "galleryImages", maxCount: 20 },
  ]),
  createAccommodation
);
router.get("/", getAccommodations);
router.get("/:id", getAccommodationById);
router.put("/:id", updateAccommodation);
router.delete("/:id", deleteAccommodation);

export default router;
