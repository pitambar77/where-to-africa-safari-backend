import express from "express";
import upload from "../../middleware/upload.js";

import {
  createConservation,
  getAllConservation,
  getConservationById,
  updateConservation,
  deleteConservation,
} from "../../controller/ConservationController/conservationController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  createConservation,
);

router.get("/", getAllConservation);
router.get("/:id", getConservationById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  updateConservation,
);

router.delete("/:id", deleteConservation);

export default router;
