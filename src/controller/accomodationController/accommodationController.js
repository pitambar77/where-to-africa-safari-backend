

// import Accommodation from "../../models/accomodationModels/accommodationModel.js";
// import Destination from "../../models/Botswana/Destination.js";

// // ✅ Helper to safely parse JSON or comma-separated strings
// const safeParse = (value) => {
//   if (!value) return [];
//   try {
//     if (typeof value === "string" && value.trim().startsWith("[")) {
//       return JSON.parse(value);
//     }
//     if (typeof value === "string") {
//       return value.split(",").map((v) => v.trim()).filter(Boolean);
//     }
//     return Array.isArray(value) ? value : [value];
//   } catch {
//     return typeof value === "string"
//       ? value.split(",").map((v) => v.trim()).filter(Boolean)
//       : [];
//   }
// };

// // ✅ CREATE Accommodation
// export const createAccommodation = async (req, res) => {
//   try {
//     const {
//       destinationId,
//       regionId,
//       bannerTitle,
//       bannerDescription,
//       overviewTitle,
//       overviewSubtitle,
//       overviewDescription,
//       destination,
//       subdestination,
//       name,
//       location,
//       pricePerPerson,
//       nightsStay,
//       accommodationType,
//       checkIn,
//       checkOut,
//       amenities,
//       galleryDescription,
//       aboutBooking,
//       requirements,
//     } = req.body;

//     // ✅ Upload images via multer-cloudinary
//     const bannerImages = req.files?.bannerImages?.map((f) => f.path) || [];
//     const galleryImages =
//       req.files?.galleryImages?.map((f) => ({ image: f.path })) || [];
//     const roomImages =
//       req.files?.roomImages?.map((f) => ({ image: f.path })) || [];

//     // ✅ Create accommodation document
//     const accommodation = await Accommodation.create({
//       bannerImages,
//       bannerTitle,
//       bannerDescription,
//       overviewTitle,
//       overviewSubtitle,
//       overviewDescription,
//       destination,
//       subdestination,
//       name,
//       location,
//       pricePerPerson,
//       nightsStay,
//       accommodationType,
//       checkIn,
//       checkOut,
//       amenities: safeParse(amenities),
//       aboutBooking: safeParse(aboutBooking),
//       requirements: safeParse(requirements),
//       gallery: {
//         description: galleryDescription || "",
//         images: galleryImages,
//       },
//       rooms: roomImages,
//     });

//     // ✅ Link to region inside destination
//     // if (destinationId && regionSlug) {
//     //   await Destination.updateOne(
//     //     { _id: destinationId, "regions.slug": regionSlug },
//     //     { $push: { "regions.$.accommodations": accommodation._id } }
//     //   );
//     // }

//       if (destinationId && regionId) {
//           await Destination.updateOne(
//             { _id: destinationId, "regions._id": regionId },
//             { $push: { "regions.$.accommodations": accommodation._id } }
//           );
//         }
    

//     res.status(201).json({
//       message: "✅ Accommodation created successfully",
//       accommodation,
//     });
//   } catch (err) {
//     console.error("❌ Error creating accommodation:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ GET all accommodations
// export const getAccommodations = async (req, res) => {
//   try {
//     const { destination, subdestination } = req.query;
//     const filter = {};
//     if (destination) filter.destination = destination;
//     if (subdestination) filter.subdestination = subdestination;

//     const accommodations = await Accommodation.find(filter).sort({
//       createdAt: -1,
//     });
//     res.json(accommodations);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ GET accommodation by ID
// export const getAccommodationById = async (req, res) => {
//   try {
//     const accommodation = await Accommodation.findById(req.params.id);
//     if (!accommodation)
//       return res.status(404).json({ message: "Accommodation not found" });
//     res.json(accommodation);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ UPDATE Accommodation
// export const updateAccommodation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = { ...req.body };

//     // Parse fields safely
//     updateData.amenities = safeParse(updateData.amenities);
//     updateData.aboutBooking = safeParse(updateData.aboutBooking);
//     updateData.requirements = safeParse(updateData.requirements);

//     // Handle image updates
//     if (req.files?.bannerImages?.length) {
//       updateData.bannerImages = req.files.bannerImages.map((f) => f.path);
//     }
//     if (req.files?.galleryImages?.length) {
//       updateData.gallery = {
//         description: req.body.galleryDescription || "",
//         images: req.files.galleryImages.map((f) => ({ image: f.path })),
//       };
//     }
//     if (req.files?.roomImages?.length) {
//       updateData.rooms = req.files.roomImages.map((f) => ({ image: f.path }));
//     }

//     const updated = await Accommodation.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updated)
//       return res.status(404).json({ message: "Accommodation not found" });

//     res.json({
//       message: "✅ Accommodation updated successfully",
//       accommodation: updated,
//     });
//   } catch (err) {
//     console.error("❌ Error updating accommodation:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ DELETE Accommodation
// export const deleteAccommodation = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const accommodation = await Accommodation.findByIdAndDelete(id);
//     if (!accommodation)
//       return res.status(404).json({ message: "Accommodation not found" });

//     // Remove link from regions in destinations
//     await Destination.updateMany(
//       { "regions.accommodations": id },
//       { $pull: { "regions.$[].accommodations": id } }
//     );

//     res.json({ message: "✅ Accommodation deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




import Accommodation from "../../models/accomodationModels/accommodationModel.js";
import Destination from "../../models/Botswana/Destination.js";


// ✅ Helper to safely parse JSON or comma-separated strings
const safeParse = (value) => {
  if (!value) return [];
  try {
    if (typeof value === "string" && value.trim().startsWith("[")) {
      return JSON.parse(value);
    }
    if (typeof value === "string") {
      return value.split(",").map((v) => v.trim()).filter(Boolean);
    }
    return Array.isArray(value) ? value : [value];
  } catch {
    return typeof value === "string"
      ? value.split(",").map((v) => v.trim()).filter(Boolean)
      : [];
  }
};

// ---------- CREATE ----------
export const createAccommodation = async (req, res) => {
  try {
    const {
      destinationId,
      regionId,
      bannerTitle,
      bannerSubtitle,
      bannerDescription,
      overviewTitle,
      overviewSubtitle,
      overviewDescription,
      destination,
      subdestination,
      name,
      location,
      pricePerPerson,
      nightsStay,
      accommodationType,
      checkIn,
      checkOut,
      amenities,
      aboutBooking,
      requirements,
      gallery,
    } = req.body;

    // Images
    const bannerImages = req.files?.bannerImages?.map(f => f.path) || [];
    const landingImage = req.files?.landingImage?.[0]?.path || "";

    // Amenities (image + name)
    const amenityImages = req.files?.amenityImages || [];
    const parsedAmenities = amenities
      ? JSON.parse(amenities).map((item, i) => ({
          amenityName: item.amenityName,
          amenityImage: amenityImages[i]?.path || "",
        }))
      : [];

    // Gallery
    const galleryImages = req.files?.galleryImages || [];
    const parsedGallery = gallery
      ? JSON.parse(gallery).map((item, i) => ({
          galleryName: item.galleryName,
          galleryImage: galleryImages[i]?.path || "",
        }))
      : [];

    const accommodation = await Accommodation.create({
      bannerImages,
      landingImage,
      bannerTitle,
      bannerSubtitle,
      bannerDescription,
      overviewTitle,
      overviewSubtitle,
      overviewDescription,
      destination,
      subdestination,
      name,
      location,
      pricePerPerson,
      nightsStay,
      accommodationType,
      checkIn,
      checkOut,
      amenities: parsedAmenities,
      gallery: parsedGallery,
      aboutBooking: JSON.parse(aboutBooking || "[]"),
      requirements: JSON.parse(requirements || "[]"),
    });

    // Link to destination → region
    if (destinationId && regionId) {
      await Destination.updateOne(
        { _id: destinationId, "regions._id": regionId },
        { $push: { "regions.$.accommodations": accommodation._id } }
      );
    }

    res.status(201).json({
      message: "✅ Accommodation created successfully",
      accommodation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateAccommodation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Images
    if (req.files?.bannerImages)
      updateData.bannerImages = req.files.bannerImages.map(f => f.path);

    if (req.files?.landingImage)
      updateData.landingImage = req.files.landingImage[0].path;

    // Amenities
    if (req.body.amenities) {
      const amenityImages = req.files?.amenityImages || [];
      updateData.amenities = JSON.parse(req.body.amenities).map((a, i) => ({
        amenityName: a.amenityName,
        amenityImage: amenityImages[i]?.path || a.amenityImage,
      }));
    }

    // Gallery
    if (req.body.gallery) {
      const galleryImages = req.files?.galleryImages || [];
      updateData.gallery = JSON.parse(req.body.gallery).map((g, i) => ({
        galleryName: g.galleryName,
        galleryImage: galleryImages[i]?.path || g.galleryImage,
      }));
    }

    if (req.body.aboutBooking)
      updateData.aboutBooking = JSON.parse(req.body.aboutBooking);

    if (req.body.requirements)
      updateData.requirements = JSON.parse(req.body.requirements);

    const updated = await Accommodation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Accommodation not found" });

    res.json({
      message: "✅ Accommodation updated successfully",
      accommodation: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ GET all accommodations
export const getAccommodations = async (req, res) => {
  try {
    const { destination, subdestination } = req.query;
    const filter = {};
    if (destination) filter.destination = destination;
    if (subdestination) filter.subdestination = subdestination;

    const accommodations = await Accommodation.find(filter).sort({
      createdAt: -1,
    });
    res.json(accommodations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET accommodation by ID
export const getAccommodationById = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation)
      return res.status(404).json({ message: "Accommodation not found" });
    res.json(accommodation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE Accommodation
export const deleteAccommodation = async (req, res) => {
  try {
    const { id } = req.params;

    const accommodation = await Accommodation.findByIdAndDelete(id);
    if (!accommodation)
      return res.status(404).json({ message: "Accommodation not found" });

    // Remove link from regions in destinations
    await Destination.updateMany(
      { "regions.accommodations": id },
      { $pull: { "regions.$[].accommodations": id } }
    );

    res.json({ message: "✅ Accommodation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

