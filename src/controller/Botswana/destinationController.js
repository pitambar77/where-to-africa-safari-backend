

// // controllers/destinationController.js
// import Destination from "../../models/Botswana/Destination.js";
// import Trip from "../../models/Botswana/Trip.js";
// import Experience from "../../models/Botswana/Experience.js";
// import Accommodation from "../../models/accomodationModels/accommodationModel.js";
// import { deleteFromCloudinary } from "../../utils/cloudinaryHelper.js";

// /**
//  * Create Destination
//  * Accepts optional image files via upload middleware:
//  * - bannerImage (single) -> will be saved at hero.bannerImage
//  * - regionImages[] (multiple) -> if provided, will be mapped to regions by index (client must send regions[] json)
//  */
// export const createDestination = async (req, res, next) => {
//   try {
//     // Expect JSON fields for name, slug, hero (as json string) and regions (json string array)
//     const { name, slug } = req.body;
//     let hero = req.body.hero ? JSON.parse(req.body.hero) : {};
//     let regions = req.body.regions ? JSON.parse(req.body.regions) : [];

//     // files may contain bannerImage, regionImages
//     if (req.files && req.files.bannerImage && req.files.bannerImage[0]) {
//       hero.bannerImage = req.files.bannerImage[0].path;
//     }

//     // If region images provided, map them by order
//     if (req.files && req.files.regionImages) {
//       regions = regions.map((r, idx) => ({
//         ...r,
//         image: req.files.regionImages[idx] ? req.files.regionImages[idx].path : r.image || "",
//       }));
//     }

//     const destination = new Destination({
//       name,
//       slug,
//       hero,
//       regions,
//     });

//     await destination.save();
//     res.status(201).json(destination);
//   } catch (err) {
//     next(err);
//   }
// };

// export const getAllDestinations = async (req, res, next) => {
//   try {
//     const items = await Destination.find()
//       .populate("trips")
//       .populate("experience")
//       .populate("accommodations")
//       .sort({ createdAt: -1 });
//     res.json(items);
//   } catch (err) {
//     next(err);
//   }
// };

// export const getDestinationById = async (req, res, next) => {
//   try {
//     const dest = await Destination.findById(req.params.id)
//       .populate("trips")
//       .populate("experience")
//       .populate("accommodations");
//     if (!dest) return res.status(404).json({ message: "Destination not found" });
//     res.json(dest);
//   } catch (err) {
//     next(err);
//   }
// };

// export const updateDestination = async (req, res, next) => {
//   try {
//     const dest = await Destination.findById(req.params.id);
//     if (!dest) return res.status(404).json({ message: "Destination not found" });

//     // update simple fields
//     if (req.body.name) dest.name = req.body.name;
//     if (req.body.slug) dest.slug = req.body.slug;

//     if (req.body.hero) {
//       const hero = typeof req.body.hero === "string" ? JSON.parse(req.body.hero) : req.body.hero;
//       dest.hero = { ...dest.hero, ...hero };
//     }

//     // handle bannerImage replacement if uploaded
//     if (req.files && req.files.bannerImage && req.files.bannerImage[0]) {
//       // attempt to delete old banner image if it exists and we saved publicId (not guaranteed)
//       // If you had stored public id earlier, modify logic accordingly
//       dest.hero.bannerImage = req.files.bannerImage[0].path;
//     }

//     // regions: full replace if provided
//     if (req.body.regions) {
//       let regions = typeof req.body.regions === "string" ? JSON.parse(req.body.regions) : req.body.regions;
//       if (req.files && req.files.regionImages) {
//         regions = regions.map((r, idx) => ({
//           ...r,
//           image: req.files.regionImages[idx] ? req.files.regionImages[idx].path : r.image || "",
//         }));
//       }
//       dest.regions = regions;
//     }

//     await dest.save();
//     res.json(dest);
//   } catch (err) {
//     next(err);
//   }
// };

// export const deleteDestination = async (req, res, next) => {
//   try {
//     const dest = await Destination.findById(req.params.id);
//     if (!dest) return res.status(404).json({ message: "Destination not found" });

//     // If destination has hero.bannerImage and you recorded publicId, delete it
//     // (We only have URL stored by default; deleting by URL is fragile. If you stored publicId in DB, use that.)
//     // Here we attempt best-effort: if bannerImage contains publicId pattern remove using last part before extension.
//     // NOTE: better to store publicId in DB at creation time.

//     await dest.remove();
//     res.json({ message: "Destination deleted" });
//   } catch (err) {
//     next(err);
//   }
// };


// // Get destination by slug
// export const getDestinationBySlug = async (req, res, next) => {
//   try {
//     const dest = await Destination.findOne({ slug: req.params.slug })
//       .populate("trips")
//       .populate("experience")
//       .populate("accommodations");

//     if (!dest) return res.status(404).json({ message: "Destination not found" });

//     res.json(dest);
//   } catch (err) {
//     next(err);
//   }
// };


import Destination from "../../models/Botswana/Destination.js";
import Trip from "../../models/Botswana/Trip.js";
import Experience from "../../models/Botswana/Experience.js";
import Accommodation from "../../models/accomodationModels/accommodationModel.js";
import { deleteFromCloudinary } from "../../utils/cloudinaryHelper.js";

// ✅ Create destination
export const createDestination = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    let hero = req.body.hero ? JSON.parse(req.body.hero) : {};
    let regions = req.body.regions ? JSON.parse(req.body.regions) : [];

    if (req.files?.bannerImage?.[0]) hero.bannerImage = req.files.bannerImage[0].path;

    if (req.files?.regionImages) {
      regions = regions.map((r, i) => ({
        ...r,
        image: req.files.regionImages[i]?.path || r.image || "",
      }));
    }

    const destination = new Destination({ name, slug, hero, regions });
    await destination.save();

    res.status(201).json(destination);
  } catch (err) {
    next(err);
  }
};

// ✅ Get all destinations (with regions & their linked items)
export const getAllDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find()
      .populate({
        path: "regions.trips",
        model: Trip,
      })
      .populate({
        path: "regions.experiences",
        model: Experience,
      })
      .populate({
        path: "regions.accommodations",
        model: Accommodation,
      })
      .sort({ createdAt: -1 });

    res.json(destinations);
  } catch (err) {
    next(err);
  }
};

// ✅ Get destination by slug (with nested data)
export const getDestinationBySlug = async (req, res, next) => {
  try {
    const dest = await Destination.findOne({ slug: req.params.slug })
      .populate({
        path: "regions.trips",
        model: Trip,
      })
      .populate({
        path: "regions.experiences",
        model: Experience,
      })
      .populate({
        path: "regions.accommodations",
        model: Accommodation,
      });

    if (!dest) return res.status(404).json({ message: "Destination not found" });

    res.json(dest);
  } catch (err) {
    next(err);
  }
};

// ✅ Get specific region by slug (within a destination)
export const getRegionBySlug = async (req, res, next) => {
  try {
    const { destinationSlug, regionSlug } = req.params;

    const destination = await Destination.findOne({ slug: destinationSlug })
      .populate({
        path: "regions.trips",
        model: Trip,
      })
      .populate({
        path: "regions.experiences",
        model: Experience,
      })
      .populate({
        path: "regions.accommodations",
        model: Accommodation,
      });

    if (!destination) return res.status(404).json({ message: "Destination not found" });

    const region = destination.regions.find((r) => r.slug === regionSlug);
    if (!region) return res.status(404).json({ message: "Region not found" });

    res.json(region);
  } catch (err) {
    next(err);
  }
};



// ✅ Update destination (including regions and hero)
export const updateDestination = async (req, res, next) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) return res.status(404).json({ message: "Destination not found" });

    if (req.body.name) dest.name = req.body.name;
    if (req.body.slug) dest.slug = req.body.slug;

    if (req.body.hero) {
      const hero = typeof req.body.hero === "string" ? JSON.parse(req.body.hero) : req.body.hero;
      dest.hero = { ...dest.hero, ...hero };
    }

    if (req.files?.bannerImage?.[0]) {
      dest.hero.bannerImage = req.files.bannerImage[0].path;
    }

    if (req.body.regions) {
      let regions = typeof req.body.regions === "string" ? JSON.parse(req.body.regions) : req.body.regions;
      if (req.files?.regionImages) {
        regions = regions.map((r, idx) => ({
          ...r,
          image: req.files.regionImages[idx]?.path || r.image || "",
        }));
      }
      dest.regions = regions;
    }

    await dest.save();
    res.json(dest);
  } catch (err) {
    next(err);
  }
};

// ✅ Delete destination
export const deleteDestination = async (req, res, next) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) return res.status(404).json({ message: "Destination not found" });

    await dest.remove();
    res.json({ message: "Destination deleted successfully" });
  } catch (err) {
    next(err);
  }
};
