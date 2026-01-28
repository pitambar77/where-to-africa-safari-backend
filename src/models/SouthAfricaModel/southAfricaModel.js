import mongoose from "mongoose";


const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },       // e.g. "South Africa"
  slug: { type: String, required: true, unique: true }, // e.g. "south-africa"
  hero: {
    title: String,
    subtitle: String,
    bannerImage: String,
    description: String,
  },
  regions: [
    {
      name: String,
      image: String,
      description: String,
      slug: String,
    },
  ],
  trips: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TripModel",
    },
  ],
  experience: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExperienceModel",
    },
  ],
  accommodations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccommodationModel",
    },
  ]
});

export default mongoose.model("Destination", destinationSchema);
