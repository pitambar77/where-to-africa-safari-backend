import express from "express";
import upload from "../../middleware/upload.js";

import {
  createFooter,
  getFooter,
  updateFooter,
  deleteFooter,
} from "../../controller/footerController/footerController.js";

const router = express.Router();

router.post("/", upload.single("logo"), createFooter);

router.get("/", getFooter);

router.put("/:id", upload.single("logo"), updateFooter);

router.delete("/:id", deleteFooter);

export default router;
