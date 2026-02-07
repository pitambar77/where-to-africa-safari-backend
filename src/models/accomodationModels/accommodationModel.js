import mongoose from "mongoose";
import slugify from "slugify";


const contentBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ["header", "paragraph", "list"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
});

const qaSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: [contentBlockSchema], // multiple answer parts (header, paragraph, list)
});

// ✅ Predefined destinations & subdestinations for dropdowns
const DESTINATIONS = [
  "Africa",
  "Asia",
  "Europe",
  "South America",
  "North America",
];
const SUBDESTINATIONS = {
  Africa: ["Kenya", "Tanzania", "South Africa", "Namibia"],
  Asia: ["Japan", "Thailand", "Vietnam", "India"],
  Europe: ["France", "Italy", "Spain", "Greece"],
  "South America": ["Peru", "Brazil", "Chile"],
  "North America": ["USA", "Canada", "Mexico"],
};

const accommodationSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      index: true,
    },


    // Landing
    bannerImage: { type: String },
    bannerTitle: { type: String },
    bannerSubtitle:{ type:String},
    bannerDescription: { type: String },

    // Overview
    overviewTitle: { type: String },
    overviewSubtitle: { type: String },
    overviewDescription: { type: String },

    // Filters (dropdowns)
    destination: { type: String, enum: DESTINATIONS, required: true },
    subdestination: { type: String, required: true },

    // Accommodation Info
    name: { type: String },
    location: { type: String },
    pricePerPerson: { type: String  },
    nightsStay: { type: String },
    accommodationType: { type: String },
    checkIn: { type: String },
    checkOut: { type: String },

    // Media
    bannerImages: [{ type: String }],
    amenities: [
      {
        amenityName: { type: String },
        amenityImage: { type: String },
      },
    ], // change Iminity section

    landingImage:{type:String},  // added it new

    // Gallery
    galleryDescription: { type: String },
    // galleryImages: [
    //   {
    //     url: String,
    //     name: String,
    //   },
    // ],
    gallery:[{
      galleryName:{ type: String },
      galleryImage:{type:String},
    }],

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

/* ================= CREATE SLUG ================= */
accommodationSchema.pre("save", async function (next) {
  if (!this.isModified("name")) return next();

  const baseSlug = slugify(this.name, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (
    await mongoose.models.Accommodation.findOne({
      slug,
      _id: { $ne: this._id },
    })
  ) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

/* ================= UPDATE SLUG ================= */
accommodationSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (!update?.name) return next();

  const baseSlug = slugify(update.name, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (
    await mongoose.models.Accommodation.findOne({
      slug,
      _id: { $ne: this.getQuery()._id },
    })
  ) {
    slug = `${baseSlug}-${count++}`;
  }

  update.slug = slug;
  next();
});

export default mongoose.model("Accommodation", accommodationSchema);
