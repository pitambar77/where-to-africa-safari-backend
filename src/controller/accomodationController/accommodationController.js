
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
      return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }
    return Array.isArray(value) ? value : [value];
  } catch {
    return typeof value === "string"
      ? value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
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
    const bannerImages = req.files?.bannerImages?.map((f) => f.path) || [];
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
    const updateData = {};

    // =====================
    // BASIC TEXT FIELDS
    // =====================
    const fields = [
      "bannerTitle",
      "bannerSubtitle",
      "bannerDescription",
      "overviewTitle",
      "overviewSubtitle",
      "overviewDescription",
      "destination",
      "subdestination",
      "name",
      "location",
      "pricePerPerson",
      "nightsStay",
      "accommodationType",
      "checkIn",
      "checkOut",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // =====================
    // IMAGES
    // =====================
    if (req.files?.bannerImages?.length) {
      updateData.bannerImages = req.files.bannerImages.map((f) => f.path);
    }

    if (req.files?.landingImage?.length) {
      updateData.landingImage = req.files.landingImage[0].path;
    }

    // =====================
    // AMENITIES
    // =====================
    const amenitiesData = safeParse(req.body.amenities);
    const amenityImages = req.files?.amenityImages || [];

    if (amenitiesData.length) {
      updateData.amenities = amenitiesData.map((a, i) => ({
        amenityName: a.amenityName,
        amenityImage: amenityImages[i]?.path || a.amenityImage || "",
      }));
    }

    // =====================
    // GALLERY
    // =====================
    const galleryData = safeParse(req.body.gallery);
    const galleryImages = req.files?.galleryImages || [];

    if (galleryData.length) {
      updateData.gallery = galleryData.map((g, i) => ({
        galleryName: g.galleryName,
        galleryImage: galleryImages[i]?.path || g.galleryImage || "",
      }));
    }

    // =====================
    // Q&A
    // =====================
    if (req.body.aboutBooking) {
      updateData.aboutBooking = safeParse(req.body.aboutBooking);
    }

    if (req.body.requirements) {
      updateData.requirements = safeParse(req.body.requirements);
    }

    // =====================
    // UPDATE
    // =====================
    const updated = await Accommodation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    res.json({
      message: "✅ Accommodation updated successfully",
      accommodation: updated,
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



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

// get Accommodation BySlug

export const getAccommodationBySlug = async (req, res) => {
  try {
    const accommodation = await Accommodation.findOne({
      slug: req.params.slug,
    });

    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

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

// delete aenity

export const deleteAmenityImage = async (req, res) => {
  const { id, index } = req.params;

  const accommodation = await Accommodation.findById(id);
  accommodation.amenities.splice(index, 1);
  await accommodation.save();

  res.json({ message: "Amenity removed" });
};

//delete gallery

export const deleteGalleryImage = async (req, res) => {
  const { id, index } = req.params;

  const accommodation = await Accommodation.findById(id);
  if (!accommodation) {
    return res.status(404).json({ message: "Accommodation not found" });
  }

  // Remove gallery item at index
  accommodation.gallery.splice(index, 1);

  await accommodation.save();

  res.json({ message: "Gallery image removed" });
};
