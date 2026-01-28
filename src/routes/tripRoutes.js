// import express from "express";
// import upload from "../middleware/upload.js";
// import * as ctrl from "../controller/Botswana/tripController.js";

// const router = express.Router();

// // create: expects multipart/form-data with optional files:
// //  - image (single)
// //  - gallery (multiple)
// router.post("/", upload.fields([
//   { name: "image", maxCount: 1 },
//   { name: "gallery", maxCount: 20 }
// ]), ctrl.createTrip);

// router.get("/", ctrl.getTrips);
// router.get("/:id", ctrl.getTripById);
// router.put("/:id", upload.fields([
//   { name: "image", maxCount: 1 },
//   { name: "gallery", maxCount: 20 }
// ]), ctrl.updateTrip);
// router.delete("/:id", ctrl.deleteTrip);

// export default router;


// routes/tripRoutes.js
// import express from "express";
// import upload from "../middleware/upload.js";
// import {
//   createTrip,
//   getAllTrips,
//   getTripById,
//   updateTrip,
//   deleteTrip,
// } from "../controllers/tripController.js";

// const router = express.Router();

// /**
//  * accepted files:
//  * - image (single)
//  * - gallery (multiple)
//  */
// router.post(
//   "/",
//   upload.fields([{ name: "image", maxCount: 1 }, { name: "gallery", maxCount: 20 }]),
//   createTrip
// );
// router.get("/", getAllTrips);
// router.get("/:id", getTripById);
// router.put("/:id", upload.fields([{ name: "image", maxCount: 1 }, { name: "gallery", maxCount: 20 }]), updateTrip);
// router.delete("/:id", deleteTrip);

// export default router;


// import express from "express";
// import upload from "../middleware/upload.js";
// import {
//   createTrip,
//   getAllTrips,
//   getTripById,
//   updateTrip,
//   deleteTrip,
// } from "../controller/Botswana/tripController.js";

// const router = express.Router();

// router.post(
//   "/",
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "gallery", maxCount: 10 },
//   ]),
//   createTrip
// );

// router.get("/", getAllTrips);
// router.get("/:id", getTripById);
// router.put(
//   "/:id",
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "gallery", maxCount: 10 },
//   ]),
//   updateTrip
// );
// router.delete("/:id", deleteTrip);

// export default router;

import express from "express";
import upload from "../middleware/upload.js";
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../controller/Botswana/tripController.js";

const router = express.Router();

/**
 * ✅ Create Trip
 * Handles:
 * - Single banner image (field: image)
 * - Multiple gallery images (field: gallery)
 * - Multiple itinerary images (field: itineraryImages)
 */
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
    { name: "itineraryImages", maxCount: 20 }, // ✅ added itinerary image upload
     { name: "tripHighlightImage", maxCount: 1 }, // ✅ single image only
  ]),
  createTrip
);

/**
 * ✅ Get All Trips
 */
router.get("/", getAllTrips);

/**
 * ✅ Get Trip by ID
 */
router.get("/:id", getTripById);

/**
 * ✅ Update Trip
 * Same fields as create
 */
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
    { name: "itineraryImages", maxCount: 20 }, // ✅ added itinerary image upload
   { name: "tripHighlightImage", maxCount: 1 }, // ✅ single image only
  ]),
  updateTrip
);

/**
 * ✅ Delete Trip
 */
router.delete("/:id", deleteTrip);

export default router;

