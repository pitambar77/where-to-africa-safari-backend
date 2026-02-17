// import express from "express";
// import upload from "../../middleware/upload.js";
// import {
//   createAccommodation,
//   getAccommodations,
//   // getAllAccommodations,
//   getAccommodationById,
//   updateAccommodation,
//   deleteAccommodation,
// } from "../../controller/accomodationController/accommodationController.js";

// const router = express.Router();

// // router.post(
// //   "/",
// //   upload.fields([
// //     { name: "bannerImages", maxCount: 5 },
// //     { name: "galleryImages", maxCount: 20 },
// //   ]),
// //   createAccommodation
// // );
// // router.get("/", getAccommodations);
// // router.get("/:id", getAccommodationById);
// // router.put("/:id", updateAccommodation);
// // router.delete("/:id", deleteAccommodation);

// router.post(
//   "/",
//   upload.fields([
//     { name: "bannerImages", maxCount: 5 },
//     { name: "landingImage", maxCount: 1 },
//     { name: "amenityImages", maxCount: 20 },
//     { name: "galleryImages", maxCount: 20 },
//   ]),
//   createAccommodation
// );

// router.put(
//   "/:id",
//   upload.fields([
//     { name: "bannerImages", maxCount: 5 },
//     { name: "landingImage", maxCount: 1 },
//     { name: "amenityImages", maxCount: 20 },
//     { name: "galleryImages", maxCount: 20 },
//   ]),
//   updateAccommodation
// );

// router.get("/", getAccommodations);
// router.get("/:id", getAccommodationById);
// router.put("/:id", updateAccommodation);
// router.delete("/:id", deleteAccommodation);


// export default router;

import express from "express";
import upload from "../../middleware/upload.js";
import {
  createAccommodation,
  getAccommodations,
  getAccommodationBySlug,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
  deleteGalleryImage,
  deleteAmenityImage
} from "../../controller/accomodationController/accommodationController.js";

const router = express.Router();

// CREATE
router.post(
  "/",
  upload.fields([
    { name: "bannerImages", maxCount: 5 },
    { name: "landingImage", maxCount: 1 },
    { name: "amenityImages", maxCount: 50 },
    { name: "galleryImages", maxCount: 20 },
  ]),
  createAccommodation
);

// UPDATE
router.put(
  "/:id",
  upload.fields([
    { name: "bannerImages", maxCount: 5 },
    { name: "landingImage", maxCount: 1 },
    { name: "amenityImages", maxCount: 50 },
    { name: "galleryImages", maxCount: 20 },
  ]),
  updateAccommodation
);

// READ
router.get("/", getAccommodations);

router.get("/slug/:slug", getAccommodationBySlug);

router.get("/:id", getAccommodationById);

// DELETE
router.delete("/:id", deleteAccommodation);

router.delete("/:id/gallery/:index", deleteGalleryImage);
router.delete("/:id/amenity/:index", deleteAmenityImage);




export default router;

