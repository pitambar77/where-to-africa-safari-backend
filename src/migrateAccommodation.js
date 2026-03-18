import mongoose from "mongoose";
import dotenv from "dotenv";

import Accommodation from "./models/accomodationModels/accommodationModel.js";
import Destination from "./models/Botswana/Destination.js";

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ DB connected");

    const accommodations = await Accommodation.find();

    let updatedCount = 0;

    for (const acc of accommodations) {
      // ✅ Skip already updated
      if (acc.destinationId && acc.regionId) continue;

      // 🔥 FIX 1: Match destination using subdestination (country)
      const dest = await Destination.findOne({
        name: acc.subdestination?.trim(),
      });

      if (!dest) {
        console.log(`❌ Destination not found: ${acc.subdestination}`);
        continue;
      }

      // 🔥 FIX 2: Match region inside destination
      const region = dest.regions.find(
        (r) =>
          r.name.trim().toLowerCase() ===
          acc.subdestination?.trim().toLowerCase()
      );

      // ⚠️ If region not found, try smarter matching (optional)
      let matchedRegion = region;

      if (!matchedRegion) {
        matchedRegion = dest.regions.find((r) =>
          acc.location?.toLowerCase().includes(r.name.toLowerCase())
        );
      }

      if (!matchedRegion) {
        console.log(`❌ Region not found: ${acc.subdestination} (${acc.name})`);
        continue;
      }

      // ✅ Assign IDs
      acc.destinationId = dest._id;
      acc.regionId = matchedRegion._id;

      await acc.save();

      // ✅ ALSO push accommodation into region
      if (!matchedRegion.accommodations.includes(acc._id)) {
        matchedRegion.accommodations.push(acc._id);
        await dest.save();
      }

      updatedCount++;
      console.log(`✅ Updated: ${acc.name}`);
    }

    console.log(`🎉 Migration done. Updated: ${updatedCount}`);
    process.exit();
  } catch (err) {
    console.error("❌ Migration error:", err);
    process.exit(1);
  }
};

migrate();
