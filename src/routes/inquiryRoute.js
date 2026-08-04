import express from "express";
import { submitInquiryForm } from "../controller/inquiryController/inquiryController.js";

const router = express.Router();

router.post("/", submitInquiryForm);

export default router;