import mongoose from "mongoose";
import dotenv from "dotenv";
import Experience from "./models/Botswana/Experience.js";
import { slugify } from "./utils/slugify.js";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const experiences = await Experience.find({});

for (let exp of experiences) {
  if (!exp.slug) {
    let baseSlug = slugify(exp.bannerTitle); // using bannerTitle
    let slug = baseSlug;
    let count = 1;

    // Handle duplicate titles
    while (await Experience.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    exp.slug = slug;
    await exp.save();
  }
}

console.log("✅ All experience slugs generated successfully");
process.exit();
