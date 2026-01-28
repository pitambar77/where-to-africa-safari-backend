// import express from "express";
// import * as ctrl from "../controller/Botswana/accommodationController.js";

// const router = express.Router();

// router.post("/", ctrl.createAccommodation);
// router.get("/", ctrl.getAccommodations);
// router.get("/:id", ctrl.getAccommodationById);
// router.put("/:id", ctrl.updateAccommodation);
// router.delete("/:id", ctrl.deleteAccommodation);

// export default router;


// // routes/accommodationRoutes.js
// import express from "express";
// import upload from "../middleware/upload.js";
// import {
//   createAccommodation,
//   getAllAccommodations,
//   getAccommodationById,
//   updateAccommodation,
//   deleteAccommodation,
// } from "../controllers/accommodationController.js";

// const router = express.Router();

// router.post(
//   "/",
//   upload.fields([{ name: "bannerImages", maxCount: 10 }, { name: "galleryImages", maxCount: 50 }]),
//   createAccommodation
// );
// router.get("/", getAllAccommodations);
// router.get("/:id", getAccommodationById);
// router.put("/:id", upload.fields([{ name: "bannerImages", maxCount: 10 }, { name: "galleryImages", maxCount: 50 }]), updateAccommodation);
// router.delete("/:id", deleteAccommodation);

// export default router;


// import express from "express";
// import upload from "../middleware/upload.js";
// import {
//   createAccommodation,
//   getAllAccommodations,
//   updateAccommodation,
//   deleteAccommodation,
// } from "../controller/Botswana/accommodationController.js";

// const router = express.Router();

// router.post(
//   "/",
//   upload.fields([
//     { name: "bannerImage", maxCount: 1 },
//     { name: "galleryImages", maxCount: 10 },
//   ]),
//   createAccommodation
// );

// router.get("/", getAllAccommodations);
// router.put(
//   "/:id",
//   upload.fields([
//     { name: "bannerImage", maxCount: 1 },
//     { name: "galleryImages", maxCount: 10 },
//   ]),
//   updateAccommodation
// );
// router.delete("/:id", deleteAccommodation);

// export default router;


// routes/accommodationRoutes.js (you already have this)
import express from "express";
import upload from "../middleware/upload.js";
import {
  createAccommodation,
  getAllAccommodations,
  updateAccommodation,
  deleteAccommodation,
} from "../controller/Botswana/accommodationController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  createAccommodation
);

router.get("/", getAllAccommodations);
router.put(
  "/:id",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  updateAccommodation
);
router.delete("/:id", deleteAccommodation);

export default router;
