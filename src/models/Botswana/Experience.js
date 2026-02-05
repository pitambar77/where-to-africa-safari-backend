import mongoose from "mongoose";

const includeSchema = new mongoose.Schema({
  name: { type: String },
  icon: { type: String  },
});

const gameDriveSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  pricePerPerson: { type:String },
  image: { type: String },
});

const highlightSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
});

const galleryImageSchema = new mongoose.Schema({
  name: { type: String },
  image: { type: String },
});

const experienceSchema = new mongoose.Schema(
  {
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    bannerImage: { type: String },
    bannerTitle: { type: String, required: true },
    bannerDescription: { type: String, required: true },

    experienceInfo: {
      days: { type:String},
      pricePerPerson: { type:String},
      location: { type: String },
      journeyType: { type: String },
    },

    overview: {
      title: { type: String, required: true },
      subTitle: { type: String },
      description: { type: String, required: true },
    },

    includes: [includeSchema],
    gameDrives: [gameDriveSchema],
    highlights: [highlightSchema],
    gallery: {
      description: { type: String },
      images: [galleryImageSchema],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Experience", experienceSchema);
