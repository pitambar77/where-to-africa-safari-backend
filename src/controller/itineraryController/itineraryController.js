
import Itinerary from "../../models/itineraryModels/itineraryModel.js";

import cloudinary from "../../config/cloudinary.js";

// ✅ Create new itinerary
export const createItinerary = async (req, res) => {
  try {
    const { name,days } = req.body;
    const parsedDays = JSON.parse(days);

    const uploadedDays = parsedDays.map((day, i) => ({
      ...day,
      image: req.files?.[i]?.path || "", // Cloudinary URL from multer-storage
      imagePublicId: req.files?.[i]?.filename || "", // Cloudinary public_id
    }));

 
    

    const itinerary = new Itinerary({ name, days: uploadedDays });
    const saved = await itinerary.save();


      

    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get all itineraries
export const getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get itinerary by ID
export const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) return res.status(404).json({ message: "Itinerary not found" });
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update itinerary (edit, replace, or keep images)
export const updateItinerary = async (req, res) => {
  try {
    const { name, days } = req.body;
    const parsedDays = JSON.parse(days);

    const existing = await Itinerary.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Itinerary not found" });

    const updatedDays = await Promise.all(
      parsedDays.map(async (day, i) => {
        // Replace image if new one uploaded
        if (req.files && req.files[i]) {
          // Delete old Cloudinary image
          if (day.imagePublicId) {
            try {
              await cloudinary.uploader.destroy(day.imagePublicId);
            } catch (err) {
              console.warn("Error deleting old image:", err.message);
            }
          }
          return {
            ...day,
            image: req.files[i].path,
            imagePublicId: req.files[i].filename,
          };
        }
        return day; // keep existing image if none uploaded
      })
    );

    existing.name = name;
    existing.days = updatedDays;
    const updated = await existing.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete itinerary and all Cloudinary images
export const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) return res.status(404).json({ message: "Not found" });

    // Delete each Cloudinary image
    for (const day of itinerary.days) {
      if (day.imagePublicId) {
        await cloudinary.uploader.destroy(day.imagePublicId);
      }
    }

    await Itinerary.findByIdAndDelete(req.params.id);
    res.json({ message: "Itinerary and images deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteItineraryImage = async (req, res) => {
  try {
    const { itineraryId, dayIndex } = req.params;

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) return res.status(404).json({ message: "Itinerary not found" });

    const day = itinerary.days[dayIndex];
    if (!day || !day.imagePublicId)
      return res.status(400).json({ message: "No image found for this day" });

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(day.imagePublicId);

    // Remove image info from DB
    itinerary.days[dayIndex].image = "";
    itinerary.days[dayIndex].imagePublicId = "";
    await itinerary.save();

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete image" });
  }
};


