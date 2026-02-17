import mongoose from "mongoose";
import { slugify } from "../../utils/slugify.js";

const itineraryItemSchema = new mongoose.Schema({
  day: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  accommodationName: { type: String, required: true },
  image: { type: String },
  imagePublicId: { type: String },
});

// ✅ Trip Highlights Schema
const tripHighlightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["Include", "Optional"], // ✅ restricts to only these two
    required: true,
  },
  tripHighlightImage: { type: String },
  imagePublicId: { type: String },
});


const contentBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ["header", "paragraph", "list"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
});

const qaSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: [contentBlockSchema], // multiple answer parts (header, paragraph, list)
});

const tripSchema = new mongoose.Schema({
  destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
  title: String,

  // ✅ ADD THIS
  slug: {
    type: String,
    unique: true,
    index: true,
  },

  subtitle: String,
  location: String,
  image: String,
  imagePublicId: String,
  duration: String,
  price: String,
  rating: String, // change number to String
  link:String,
  description: String,
  overviewTitle: { type: String, required: true },
  overviewSubTitle: { type: String,required:true },
  overviewDescription: { type: String, required: true },
  gallery: [
    {
      url: String,
      publicId: String,
    },
  ],
   // Sections
    aboutBooking: [qaSchema],
    requirements: [qaSchema],
  itinerary: [itineraryItemSchema],
   // ✅ New Trip Highlights section
    tripHighlights: [tripHighlightSchema],

}, { timestamps: true });

tripSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next(); // Only regenerate if title changes

  if (!this.slug) {
    let baseSlug = slugify(this.title);
    let slug = baseSlug;
    let count = 1;

    const Trip = mongoose.model("Trip");

    // Exclude current document from duplicate check
    while (await Trip.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    this.slug = slug;
  }

  next();
});


export default mongoose.model("Trip", tripSchema);
