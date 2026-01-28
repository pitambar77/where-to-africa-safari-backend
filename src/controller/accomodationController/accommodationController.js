

// import Accommodation from "../../models/accomodationModels/accommodationModel.js";
// import Destination from "../../models/Botswana/Destination.js";

// // ✅ Create New Accommodation
// export const createAccommodation = async (req, res) => {
//   try {
//     const {
//       destinationId, // 👈 You must send this from frontend
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

//     const bannerImages = req.files["bannerImages"]?.map(f => f.path) || [];
//     const galleryImages =
//       req.files["galleryImages"]?.map(f => ({
//         url: f.path,
//         name: f.originalname,
//       })) || [];

//     const newAcc = new Accommodation({
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
//       amenities: amenities ? amenities.split(",") : [],
//       bannerImages,
//       galleryDescription,
//       galleryImages,
//       aboutBooking: aboutBooking ? JSON.parse(aboutBooking) : [],
//       requirements: requirements ? JSON.parse(requirements) : [],
//     });


//       // ✅ Link Experience to Destination (if destinationId provided)
//         if (destinationId) {
//           await Destination.findByIdAndUpdate(destinationId, {
//             $push: { accommodations:newAcc._id},
//           });
//         }

//     await newAcc.save();
//     res.status(201).json({ message: "Accommodation created successfully", newAcc });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ✅ Get All Accommodations (supports dropdown filter)
// export const getAccommodations = async (req, res) => {
//   try {
//     const { destination, subdestination } = req.query;
//     const filter = {};
//     if (destination) filter.destination = destination;
//     if (subdestination) filter.subdestination = subdestination;

//     const data = await Accommodation.find(filter);
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // ✅ Get Single Accommodation by ID
// export const getAccommodationById = async (req, res) => {
//   try {
//     const data = await Accommodation.findById(req.params.id);
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // ✅ Update Accommodation
// export const updateAccommodation = async (req, res) => {
//   try {
//     const updated = await Accommodation.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // ✅ Delete Accommodation
// export const deleteAccommodation = async (req, res) => {
//   try {
//     await Accommodation.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Accommodation deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// import Accommodation from "../../models/Botswana/Accommodation.js";
// import Destination from "../../models/Botswana/Destination.js";
// import cloudinary from "../../config/cloudinary.js";

// // ✅ CREATE Accommodation
// export const createAccommodation = async (req, res) => {
//   try {
//     const {
//       destinationId,
//       regionSlug,
//       bannerTitle,
//       bannerDescription,
//       overviewTitle,
//       overviewSubtitle,
//       overviewDescription,
//       pricePerPerson,
//       amenities,
//       aboutBooking,
//       requirements,
//       galleryDescription,
//     } = req.body;

//     const bannerImage = req.files?.bannerImage?.[0]?.path || null;
//     const galleryImages = req.files?.galleryImages?.map(f => ({ image: f.path })) || [];
//     const roomImages = req.files?.roomImages?.map(f => f.path) || [];

//     const accommodation = await Accommodation.create({
//       bannerImage,
//       bannerTitle,
//       bannerDescription,
//       overviewTitle,
//       overviewSubtitle,
//       overviewDescription,
//       pricePerPerson,
//       amenities: JSON.parse(amenities),
//       aboutBooking,
//       requirements,
//       rooms: roomImages.map(img => ({ image: img })),
//       gallery: { description: galleryDescription, images: galleryImages },
//     });

//     // ✅ Link to region
//     if (destinationId && regionSlug) {
//       await Destination.updateOne(
//         { _id: destinationId, "regions.slug": regionSlug },
//         { $push: { "regions.$.accommodations": accommodation._id } }
//       );
//     }

//     res.status(201).json({ message: "Accommodation created successfully", accommodation });
//   } catch (err) {
//     console.error("Error creating accommodation:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ GET All Accommodations
// export const  getAccommodations = async (req, res) => {
//   try {
//     const accommodations = await Accommodation.find();
//     res.json(accommodations);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ GET by ID
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
//     const updateData = req.body;

//     if (req.files?.bannerImage) {
//       updateData.bannerImage = req.files.bannerImage[0].path;
//     }

//     if (req.files?.galleryImages) {
//       updateData.gallery = {
//         description: req.body.galleryDescription,
//         images: req.files.galleryImages.map((f) => ({ image: f.path })),
//       };
//     }

//     const updated = await Accommodation.findByIdAndUpdate(id, updateData, { new: true });
//     if (!updated) return res.status(404).json({ message: "Accommodation not found" });

//     res.json({ message: "Accommodation updated successfully", updated });
//   } catch (err) {
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

//     // ✅ Unlink from Destination region
//     await Destination.updateMany(
//       { "regions.accommodations": id },
//       { $pull: { "regions.$[].accommodations": id } }
//     );

//     res.json({ message: "Accommodation deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// by id

// import Accommodation from "../../models/accomodationModels/accommodationModel.js";
// import Destination from "../../models/Botswana/Destination.js";
// import cloudinary from "../../config/cloudinary.js";

// // ✅ CREATE Accommodation
// export const createAccommodation = async (req, res) => {
//   try {
//     const {
//       destinationId,
//       regionId, // ✅ updated from regionSlug
//       bannerTitle,
//       bannerDescription,
//       overviewTitle,
//       overviewSubtitle,
//       overviewDescription,
//       pricePerPerson,
//       amenities,
//       aboutBooking,
//       requirements,
//       galleryDescription,
//     } = req.body;

//     // ✅ Upload images from multer (Cloudinary)
//     const bannerImages = req.files?.bannerImage?.[0]?.path || null;
//     const galleryImages = req.files?.galleryImages?.map((f) => ({ image: f.path })) || [];
//     const roomImages = req.files?.roomImages?.map((f) => ({ image: f.path })) || [];

//     // ✅ Create new accommodation document
//     const accommodation = await Accommodation.create({
//       bannerImages,
//       bannerTitle,
//       bannerDescription,
//       overviewTitle,
//       overviewSubtitle,
//       overviewDescription,
//       pricePerPerson,
//       amenities: amenities ? JSON.parse(amenities) : [],
//       aboutBooking: aboutBooking ? JSON.parse(aboutBooking) : [],
//       requirements: requirements ? JSON.parse(requirements) : [],
//       rooms: roomImages.map((img) => ({ image: img })),
//       gallery: {
//         description: galleryDescription || "",
//         images: galleryImages,
//       },
//     });

//     // ✅ Link this accommodation to the correct region
//     if (destinationId && regionId) {
//       await Destination.updateOne(
//         { _id: destinationId, "regions._id": regionId },
//         { $push: { "regions.$.accommodations": accommodation._id } }
//       );
//     }

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
//     const accommodations = await Accommodation.find().sort({ createdAt: -1 });
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

//     // ✅ Parse JSON string fields safely
//     ["amenities", "aboutBooking", "requirements"].forEach((key) => {
//       if (updateData[key]) {
//         try {
//           updateData[key] = JSON.parse(updateData[key]);
//         } catch {
//           updateData[key] = updateData[key];
//         }
//       }
//     });

//     // ✅ Replace uploaded files if present
//     if (req.files?.bannerImages?.length) {
//       updateData.bannerImages = req.files.bannerImages[0].path;
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

//     // ✅ Unlink accommodation from all regions in destinations
//     await Destination.updateMany(
//       { "regions.accommodations": id },
//       { $pull: { "regions.$[].accommodations": id } }
//     );

//     res.json({ message: "✅ Accommodation deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// import Accommodation from "../../models/accomodationModels/accommodationModel.js";
// import Destination from "../../models/Botswana/Destination.js";
// import cloudinary from "../../config/cloudinary.js";

// // ✅ Helper function for safe parsing
// const safeParse = (value) => {
//   if (!value) return [];
//   try {
//     // if it's already a JSON array string
//     if (typeof value === "string" && value.trim().startsWith("[")) {
//       return JSON.parse(value);
//     }
//     // if it's a plain string like "wifi, ac, tv"
//     if (typeof value === "string") {
//       return value.split(",").map((v) => v.trim()).filter((v) => v);
//     }
//     // if it's already an array
//     return Array.isArray(value) ? value : [value];
//   } catch {
//     // fallback: split by comma
//     return value.split(",").map((v) => v.trim()).filter((v) => v);
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
//       pricePerPerson,
//       amenities,
//       aboutBooking,
//       requirements,
//       galleryDescription,
//     } = req.body;

//     // ✅ Upload images from multer (Cloudinary)
//     const bannerImages = req.files?.bannerImages?.[0]?.path || null;
//     const galleryImages =
//       req.files?.galleryImages?.map((f) => ({ image: f.path })) || [];
//     const roomImages =
//       req.files?.roomImages?.map((f) => ({ image: f.path })) || [];

//     // ✅ Create new accommodation document
//     const accommodation = await Accommodation.create({
//       bannerImages,
//       bannerTitle,
//       bannerDescription,
//       overviewTitle,
//       overviewSubtitle,
//       overviewDescription,
//       pricePerPerson,
//       amenities: safeParse(amenities),
//       aboutBooking: safeParse(aboutBooking),
//       requirements: safeParse(requirements),
//       rooms: roomImages.map((img) => ({ image: img.image })),
//       gallery: {
//         description: galleryDescription || "",
//         images: galleryImages,
//       },
//     });

//     // ✅ Link accommodation to correct region
//     if (destinationId && regionId) {
//       await Destination.updateOne(
//         { _id: destinationId, "regions._id": regionId },
//         { $push: { "regions.$.accommodations": accommodation._id } }
//       );
//     }

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
//     const accommodations = await Accommodation.find().sort({ createdAt: -1 });
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

//     // ✅ Safely parse possible JSON or comma-separated strings
//     updateData.amenities = safeParse(updateData.amenities);
//     updateData.aboutBooking = safeParse(updateData.aboutBooking);
//     updateData.requirements = safeParse(updateData.requirements);

//     // ✅ Replace uploaded files if present
//     if (req.files?.bannerImages?.length) {
//       updateData.bannerImages = req.files.bannerImages[0].path;
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

//     // ✅ Unlink accommodation from all regions in destinations
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

// ✅ CREATE Accommodation
export const createAccommodation = async (req, res) => {
  try {
    const {
      destinationId,
      regionId,
      bannerTitle,
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
      galleryDescription,
      aboutBooking,
      requirements,
    } = req.body;

    // ✅ Upload images via multer-cloudinary
    const bannerImages = req.files?.bannerImages?.map((f) => f.path) || [];
    const galleryImages =
      req.files?.galleryImages?.map((f) => ({ image: f.path })) || [];
    const roomImages =
      req.files?.roomImages?.map((f) => ({ image: f.path })) || [];

    // ✅ Create accommodation document
    const accommodation = await Accommodation.create({
      bannerImages,
      bannerTitle,
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
      amenities: safeParse(amenities),
      aboutBooking: safeParse(aboutBooking),
      requirements: safeParse(requirements),
      gallery: {
        description: galleryDescription || "",
        images: galleryImages,
      },
      rooms: roomImages,
    });

    // ✅ Link to region inside destination
    // if (destinationId && regionSlug) {
    //   await Destination.updateOne(
    //     { _id: destinationId, "regions.slug": regionSlug },
    //     { $push: { "regions.$.accommodations": accommodation._id } }
    //   );
    // }

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
    console.error("❌ Error creating accommodation:", err);
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

// ✅ UPDATE Accommodation
export const updateAccommodation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Parse fields safely
    updateData.amenities = safeParse(updateData.amenities);
    updateData.aboutBooking = safeParse(updateData.aboutBooking);
    updateData.requirements = safeParse(updateData.requirements);

    // Handle image updates
    if (req.files?.bannerImages?.length) {
      updateData.bannerImages = req.files.bannerImages.map((f) => f.path);
    }
    if (req.files?.galleryImages?.length) {
      updateData.gallery = {
        description: req.body.galleryDescription || "",
        images: req.files.galleryImages.map((f) => ({ image: f.path })),
      };
    }
    if (req.files?.roomImages?.length) {
      updateData.rooms = req.files.roomImages.map((f) => ({ image: f.path }));
    }

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
    console.error("❌ Error updating accommodation:", err);
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
