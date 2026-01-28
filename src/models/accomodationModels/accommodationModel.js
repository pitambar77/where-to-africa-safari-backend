

import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ["header", "paragraph", "list"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
});

const qaSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: [contentBlockSchema], // multiple answer parts (header, paragraph, list)
});

// ✅ Predefined destinations & subdestinations for dropdowns
const DESTINATIONS = ["Africa", "Asia", "Europe", "South America", "North America"];
const SUBDESTINATIONS = {
  Africa: ["Kenya", "Tanzania", "South Africa", "Namibia"],
  Asia: ["Japan", "Thailand", "Vietnam", "India"],
  Europe: ["France", "Italy", "Spain", "Greece"],
  "South America": ["Peru", "Brazil", "Chile"],
  "North America": ["USA", "Canada", "Mexico"],
};

const accommodationSchema = new mongoose.Schema(
  {
    // Landing
    bannerImage: { type: String },
    bannerTitle: { type: String },
    bannerDescription: { type: String },

    // Overview
    overviewTitle: { type: String },
    overviewSubtitle: { type: String },
    overviewDescription: { type: String },

    // Filters (dropdowns)
    destination: { type: String, enum: DESTINATIONS, required: true },
    subdestination: { type: String, required: true },

    // Accommodation Info
    name: { type: String, required: true },
    location: { type: String, required: true },
    pricePerPerson: { type: Number, required: true },
    nightsStay: { type: Number, required: true },
    accommodationType: { type: String, required: true },
    checkIn: { type: String },
    checkOut: { type: String },

    // Media
    bannerImages: [{ type: String }],
    amenities: [{ type: String }],

    // Gallery
    galleryDescription: { type: String },
    galleryImages: [
      {
        url: String,
        name: String,
      },
    ],

    // Sections
    aboutBooking: [qaSchema],
    requirements: [qaSchema],
  },
  { timestamps: true }
);

// ✅ Custom validation: subdestination must match selected destination
accommodationSchema.path("subdestination").validate(function (value) {
  const validSubs = SUBDESTINATIONS[this.destination] || [];
  return validSubs.includes(value);
}, "Invalid subdestination for selected destination");

export default mongoose.model("Accommodation", accommodationSchema);
