import express from "express";
import upload from "../../middleware/upload.js";

import {
  createContactus,
  getAllContactus,
  getContactusById,
  updateContactus,
  deleteContactus,
} from "../../controller/contactusController/contactuspageController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  createContactus,
);

router.get("/", getAllContactus);
router.get("/:id", getContactusById);

router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    
  ]),
  updateContactus,
);

router.delete("/:id", deleteContactus);

export default router;
