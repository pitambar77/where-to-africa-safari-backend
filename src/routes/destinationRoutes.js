
import express from "express";
import upload from "../middleware/upload.js";
import {
  createDestination,
  getAllDestinations,
  // getDestinationById,
  updateDestination,
  deleteDestination,
  getDestinationBySlug,
  getRegionBySlug
} from "../controller/Botswana/destinationController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "regionImages", maxCount: 10 },
  ]),
  createDestination
);

router.get("/slug/:slug", getDestinationBySlug); // ✅ add this

router.get("/:destinationSlug/regions/:regionSlug", getRegionBySlug);


router.get("/", getAllDestinations);
// router.get("/:id", getDestinationById);
router.put(
  "/:id",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "regionImages", maxCount: 10 },
  ]),
  updateDestination
);
router.delete("/:id", deleteDestination);

export default router;
