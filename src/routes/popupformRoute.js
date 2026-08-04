import express from "express";
import { submitPopupform } from "../controller/popupformController/popupformController.js";

const router = express.Router();

router.post("/", submitPopupform);

export default router;