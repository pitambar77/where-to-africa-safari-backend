
import Trip from "../../models/Botswana/Trip.js";
import Destination from "../../models/Botswana/Destination.js";

// ✅ Helper to safely parse JSON or comma-separated values
const safeParse = (value) => {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    if (typeof value === "string")
      return value.split(",").map((v) => v.trim()).filter(Boolean);
    return [];
  }
};

// ✅ CREATE Trip
export const createTrip = async (req, res) => {
  try {
    const {
      destinationId,
      regionId,
      title,
      subtitle,
      location,
      duration,
      price,
      rating,
      description,
      itinerary,
      overviewTitle,
      overviewSubTitle,
      overviewDescription,
       aboutBooking,
      requirements,
      tripHighlights, // ✅ added here
    } = req.body;

    if (!destinationId || !regionId) {
      return res.status(400).json({ message: "Destination and Region are required" });
    }

    // ✅ Handle image uploads
    const image = req.files?.image?.[0]?.path || null;
    const gallery = req.files?.gallery?.map((f) => ({
      url: f.path,
      publicId: f.filename,
    })) || [];

    const itineraryImages = req.files?.itineraryImages?.map((f) => f.path) || [];

    // ✅ Parse itinerary JSON + attach images
    const parsedItinerary = safeParse(itinerary).map((item, i) => ({
      ...item,
      image: itineraryImages[i] || item.image || null,
    }));


const tripHighlightImage = req.files?.tripHighlightImage?.[0]?.path || null;

const parsedTripHighlights = safeParse(tripHighlights).map((item) => ({
  ...item,
  tripImage: tripHighlightImage || item.tripImage || null,
}));


    // ✅ Create Trip
    const trip = await Trip.create({
      destination: destinationId,
      title,
      subtitle,
      location,
      duration,
      price,
      rating,
      description,
      image,
      gallery,
      overviewTitle,
      overviewSubTitle,
      overviewDescription,
       aboutBooking: safeParse(aboutBooking),
      requirements: safeParse(requirements),
      itinerary: parsedItinerary,
      tripHighlights:parsedTripHighlights,

    });

    // ✅ Link Trip to region inside Destination
    await Destination.updateOne(
      { _id: destinationId, "regions._id": regionId },
      { $push: { "regions.$.trips": trip._id } }
    );

    res.status(201).json({ message: "✅ Trip created successfully", trip });
  } catch (err) {
    console.error("❌ Error creating trip:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET All Trips
export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate("destination");
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET Trip by ID
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("destination");
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE Trip
export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

     updateData.aboutBooking = safeParse(updateData.aboutBooking);
    updateData.requirements = safeParse(updateData.requirements);
// updateData.tripHighlights = safeParse(updateData.tripHighlights);

if (updateData.tripHighlights) {
  const tripHighlightImage = req.files?.tripHighlightImage?.[0]?.path || null;
  const parsedTripHighlights = safeParse(updateData.tripHighlights).map((item) => ({
    ...item,
    tripImage: tripHighlightImage || item.tripImage || null,
  }));
  updateData.tripHighlights = parsedTripHighlights;
}


    // ✅ Update images if provided
    if (req.files?.image?.length) {
      updateData.image = req.files.image[0].path;
    }
    if (req.files?.gallery?.length) {
      updateData.gallery = req.files.gallery.map((f) => ({
        url: f.path,
        publicId: f.filename,
      }));
    }

    // ✅ Handle itinerary
    if (updateData.itinerary) {
      const itineraryImages = req.files?.itineraryImages?.map((f) => f.path) || [];
      const parsedItinerary = safeParse(updateData.itinerary).map((item, i) => ({
        ...item,
        image: itineraryImages[i] || item.image || null,
      }));
      updateData.itinerary = parsedItinerary;
    }

    const updatedTrip = await Trip.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTrip) return res.status(404).json({ message: "Trip not found" });

    res.json({ message: "✅ Trip updated successfully", trip: updatedTrip });
  } catch (err) {
    console.error("❌ Error updating trip:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE Trip
export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findByIdAndDelete(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // ✅ Unlink from regions
    await Destination.updateMany(
      { "regions.trips": id },
      { $pull: { "regions.$[].trips": id } }
    );

    res.json({ message: "✅ Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
