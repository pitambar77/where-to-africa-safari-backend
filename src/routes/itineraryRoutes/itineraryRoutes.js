// import express from "express";
// import upload from "../../middleware/upload.js";
// import {
//   createItinerary,
//   getAllItineraries,
//   getItineraryById,
//   updateItinerary,
//   deleteItinerary,
// } from "../../controller/itineraryController/itineraryController.js";

// const router = express.Router();

// // Multiple file uploads (one image per day)
// router.post("/", upload.array("images"), createItinerary);
// router.get("/", getAllItineraries);
// router.get("/:id", getItineraryById);
// router.put("/:id", upload.array("images"), updateItinerary);
// router.delete("/:id", deleteItinerary);

// export default router;


import express from "express";
import upload from "../../middleware/upload.js";
import {
  createItinerary,
  getAllItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
  deleteItineraryImage,
} from "../../controller/itineraryController/itineraryController.js";

const router = express.Router();

// Create with multiple images (one per day)
router.post("/", upload.array("images"), createItinerary);

// Read
router.get("/", getAllItineraries);
router.get("/:id", getItineraryById);

// Update (with optional image replace)
router.put("/:id", upload.array("images"), updateItinerary);

// Delete
router.delete("/:id", deleteItinerary);

// ✅ new route to delete a specific image from a day
router.delete("/:itineraryId/day/:dayIndex/image", deleteItineraryImage);

export default router;
