import express from "express";
import upload from "../middleware/upload.js";
import {
  createDestination,
  getAllDestinations,
  updateDestination,
  deleteDestination,
  getDestinationBySlug,
  getRegionBySlug,
  getDestinationById,
} from "../controller/Botswana/destinationController.js";

const router = express.Router();

/* CREATE */
router.post(
  "/",
  upload.any(), // ✅ REQUIRED for dynamic fields
  createDestination
);

/* GET */
router.get("/", getAllDestinations);
router.get("/slug/:slug", getDestinationBySlug);
router.get("/:destinationSlug/regions/:regionSlug", getRegionBySlug);

router.get("/:id", getDestinationById);

/* UPDATE */
router.put(
  "/:id",
  upload.any(), // ✅ REQUIRED for dynamic fields
  updateDestination
);

/* DELETE */
router.delete("/:id", deleteDestination);

export default router;
