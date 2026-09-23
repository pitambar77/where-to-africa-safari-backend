import express from "express";

import {
  submitItineraryForm,
} from "../../controller/itineraryController/itineraryFormController.js";

const router = express.Router();

router.post("/", submitItineraryForm);

export default router;