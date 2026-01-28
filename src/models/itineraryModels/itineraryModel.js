


import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
  day: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  accommodationName: { type: String, required: true },
  image: { type: String }, // Cloudinary URL
  imagePublicId: { type: String }, // store Cloudinary public_id for deletion
});

const itinerarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    days: [daySchema],
  },
  { timestamps: true }
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);
export default Itinerary;
