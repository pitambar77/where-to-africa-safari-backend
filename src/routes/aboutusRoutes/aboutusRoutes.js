import express from "express";
import upload from "../../middleware/upload.js";

import {
  createAboutus,
  getAllAboutus,
  getAboutusById,
  updateAboutus,
  deleteAboutus,
} from "../../controller/aboutusController/aboutusController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  createAboutus,
);

router.get("/", getAllAboutus);
router.get("/:id", getAboutusById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  updateAboutus,
);

router.delete("/:id", deleteAboutus);

export default router;
