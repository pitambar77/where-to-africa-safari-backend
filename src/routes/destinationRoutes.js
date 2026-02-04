
// import express from "express";
// import upload from "../middleware/upload.js";
// import {
//   createDestination,
//   getAllDestinations,
//   // getDestinationById,
//   updateDestination,
//   deleteDestination,
//   getDestinationBySlug,
//   getRegionBySlug
// } from "../controller/Botswana/destinationController.js";

// const router = express.Router();

// router.post(
//   "/",
//   upload.fields([
//     { name: "bannerImage", maxCount: 1 },
//     { name: "regionImages", maxCount: 10 },
//       { name: "thingsTodoImages", maxCount: 50 },
//   ]),
//   createDestination
// );

// router.get("/slug/:slug", getDestinationBySlug); // ✅ add this

// router.get("/:destinationSlug/regions/:regionSlug", getRegionBySlug);


// router.get("/", getAllDestinations);
// // router.get("/:id", getDestinationById);
// router.put(
//   "/:id",
//   upload.fields([
//     { name: "bannerImage", maxCount: 1 },
//     { name: "regionImages", maxCount: 10 },
//       { name: "thingsTodoImages", maxCount: 50 },
//   ]),
//   updateDestination
// );
// router.delete("/:id", deleteDestination);

// export default router;


import express from "express";
import upload from "../middleware/upload.js";
import {
  createDestination,
  getAllDestinations,
  updateDestination,
  deleteDestination,
  getDestinationBySlug,
  getRegionBySlug,
} from "../controller/Botswana/destinationController.js";

const router = express.Router();

/* CREATE */
router.post(
  "/",
  upload.any(),        // ✅ REQUIRED for dynamic fields
  createDestination
);

/* GET */
router.get("/", getAllDestinations);
router.get("/slug/:slug", getDestinationBySlug);
router.get("/:destinationSlug/regions/:regionSlug", getRegionBySlug);

/* UPDATE */
router.put(
  "/:id",
  upload.any(),        // ✅ REQUIRED for dynamic fields
  updateDestination
);

/* DELETE */
router.delete("/:id", deleteDestination);

export default router;

