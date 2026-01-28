// import mongoose from "mongoose";

// const regionSchema = new mongoose.Schema({
//   name: String,
//   image: String,
//   description: String,
//   slug: String,
// });

// const destinationSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   slug: { type: String, required: true, unique: true },
//   hero: {
//     title: String,
//     subtitle: String,
//     bannerImage: String,
//     description: String,
//   },
//   regions: [regionSchema],
//   trips: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Trip",
//     },
//   ],
//   experience: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Experience",
//     },
//   ],
//   accommodations: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Accommodation",
//     },
//   ],
// }, { timestamps: true });

// export default mongoose.model("Destination", destinationSchema);


// models/Botswana/Destination.js

// national park under all things

import mongoose from "mongoose";

const regionSchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  description: String,
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
  experiences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
  accommodations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Accommodation" }],
});

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    hero: {
      title: String,
      subtitle: String,
      bannerImage: String,
      description: String,
    },
    regions: [regionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Destination", destinationSchema);
