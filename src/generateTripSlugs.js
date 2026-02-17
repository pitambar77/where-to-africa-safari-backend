import mongoose from "mongoose";
import dotenv from "dotenv";
import Trip from "./models/Botswana/Trip.js";
import { slugify } from "./utils/slugify.js";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const trips = await Trip.find({});

for (let trip of trips) {
  if (!trip.slug) {
    let baseSlug = slugify(trip.title);
    let slug = baseSlug;
    let count = 1;

    // Handle duplicate titles
    while (await Trip.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    trip.slug = slug;
    await trip.save();
  }
}

console.log("✅ All trip slugs generated successfully");
process.exit();
