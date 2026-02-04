// // models/Botswana/Destination.js

// // national park under all things

// import mongoose from "mongoose";

// const regionSchema = new mongoose.Schema({
//   name: String,
//   slug: String,
//   image: String,
//   description: String,
//   trips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
//   experiences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
//   accommodations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Accommodation" }],
// });

// const destinationSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     slug: { type: String, required: true, unique: true },
//     hero: {
//       title: String,
//       subtitle: String,
//       bannerImage: String,
//       description: String,
//     },
//     regions: [regionSchema],
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Destination", destinationSchema);

// models/Botswana/Destination.js

// national park under all things

import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ["header", "paragraph", "list"], required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
});

const whenvisitSchema = new mongoose.Schema({
    heading:String,
    months:[
        {
            monthname:String,
            title:String,
            description:[contentBlockSchema],
            // image: String, // added image
            // imagePublicId: String,
        }
    ]
})

const thingstodoSchema = new mongoose.Schema({
  thinstodoTitle: String,
  thingstododescription:[contentBlockSchema],

  section: [
    {
      title: String,
      description: String,
      image: String,
      imagePublicId: { type: String },
    },
  ],
});

const regionSchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  description: String,
  subtitle: String,

  level:String,

  facility: String,
  levelsec:String,
  highlight: String,
  levelthird:String,
  culture: String,
  levelfourth:String,
  days: String,

  overviewTitle: String,
  overviewSubTitle: String,
  overviewDescription: String,

  thingstodo:[thingstodoSchema],

  whenvisit:[whenvisitSchema],


  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
  experiences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
  accommodations: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Accommodation" },
  ],
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
