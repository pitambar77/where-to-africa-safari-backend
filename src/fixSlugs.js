import mongoose from "mongoose";
import dotenv from "dotenv";
import Destination from "./models/Botswana/Destination.js";

const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

dotenv.config();


// async function fixDestinationSlugs() {
//   await mongoose.connect(process.env.MONGODB_URI);

//   const destinations = await Destination.find();

//   for (const dest of destinations) {
//     const newSlug = slugify(dest.name);

//     if (dest.slug !== newSlug) {
//       console.log(`Updating: ${dest.slug} → ${newSlug}`);
//       dest.slug = newSlug;
//       await dest.save();
//     }
//   }

//   console.log("✅ All destination slugs updated!");
//   process.exit();
// }

async function fixRegionSlugs() {
  await mongoose.connect(process.env.MONGODB_URI);

  const destinations = await Destination.find();

  for (const dest of destinations) {
    let updated = false;

    dest.regions = dest.regions.map((region) => {
      const newSlug = slugify(region.name);

      if (region.slug !== newSlug) {
        console.log(
          `Destination: ${dest.name} | Region: ${region.slug} → ${newSlug}`
        );
        updated = true;
        return {
          ...region.toObject(),
          slug: newSlug,
        };
      }

      return region;
    });

    if (updated) {
      await dest.save();
    }
  }

  console.log("✅ All region slugs updated!");
  process.exit();
}

fixRegionSlugs();
