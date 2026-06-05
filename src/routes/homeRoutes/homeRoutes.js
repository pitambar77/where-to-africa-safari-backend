import express from "express";
import upload from "../../middleware/upload.js";

import {
  createHome,
  getAllHome,
  getHomeById,
  updateHome,
  deleteHome,
} from "../../controller/homeController/homeController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  createHome,
);

router.get("/", getAllHome);
router.get("/:id", getHomeById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  updateHome,
);

router.delete("/:id", deleteHome);

export default router;
