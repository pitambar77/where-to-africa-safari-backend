// region by destiinationId or regionsId

import Experience from "../../models/Botswana/Experience.js";
import Destination from "../../models/Botswana/Destination.js";
import cloudinary from "../../config/cloudinary.js";

export const createExperience = async (req, res) => {
  try {
    const {
      destinationId,
      regionId, // ✅ now we use regionId instead of regionSlug
      bannerTitle,
      bannerDescription,
      experienceInfo,
      overview,
      includes,
      gameDrives,
      highlights,
      galleryDescription,
    } = req.body;

    // ✅ Handle uploads
    const bannerImage = req.files?.bannerImage?.[0]?.path || null;
    const galleryImages =
      req.files?.galleryImages?.map((f) => ({ image: f.path })) || [];

    // ✅ Parse and merge gameDrives
    let parsedGameDrives = [];
    if (gameDrives) {
      const drives = JSON.parse(gameDrives);
      const driveImages = req.files?.gameDriveImages?.map((f) => f.path) || [];
      parsedGameDrives = drives.map((drive, i) => ({
        ...drive,
        image: driveImages[i] || drive.image || null,
      }));
    }

    // ✅ Parse and merge highlights
    let parsedHighlights = [];
    if (highlights) {
      const hlData = JSON.parse(highlights);
      const hlImages = req.files?.highlightImages?.map((f) => f.path) || [];
      parsedHighlights = hlData.map((h, i) => ({
        ...h,
        image: hlImages[i] || h.image || null,
      }));
    }

    // ✅ Create Experience document
    const experience = await Experience.create({
      destination: destinationId, // ✅ ADD
      region: regionId, // ✅ ADD
      bannerImage,
      bannerTitle,
      bannerDescription,
      experienceInfo: JSON.parse(experienceInfo),
      overview: JSON.parse(overview),
      includes: JSON.parse(includes),
      gameDrives: parsedGameDrives,
      highlights: parsedHighlights,
      gallery: { description: galleryDescription, images: galleryImages },
    });

    // ✅ Link experience to destination + region
    if (destinationId && regionId) {
      await Destination.updateOne(
        { _id: destinationId, "regions._id": regionId },
        { $push: { "regions.$.experiences": experience._id } }
      );
    }

    res.status(201).json({
      message: "Experience created successfully",
      experience,
    });
  } catch (error) {
    console.error("Error creating experience:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET All Experiences (optionally populate destination info)
export const getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().populate({
      path: "destinationId",
      select: "name slug hero",
    });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET Single Experience by ID
export const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;

    const experience = await Experience.findById(id).populate({
      path: "destinationId",
      select: "name slug hero",
    });

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.json(experience);
  } catch (error) {
    console.error("Error fetching experience:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE Experience (supports partial updates and new images)
// export const updateExperience = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updateData = { ...req.body };

//     // ✅ Handle reuploads
//     if (req.files?.bannerImage?.[0]) {
//       updateData.bannerImage = req.files.bannerImage[0].path;
//     }

//     if (req.files?.galleryImages) {
//       updateData.gallery = {
//         description: req.body.galleryDescription,
//         images: req.files.galleryImages.map((f) => ({ image: f.path })),
//       };
//     }

//     // ✅ Rebuild highlights/gameDrives if updated
//     if (req.body.highlights)
//       updateData.highlights = JSON.parse(req.body.highlights);
//     if (req.body.gameDrives)
//       updateData.gameDrives = JSON.parse(req.body.gameDrives);
//     if (req.body.experienceInfo)
//       updateData.experienceInfo = JSON.parse(req.body.experienceInfo);
//     if (req.body.overview) updateData.overview = JSON.parse(req.body.overview);
//     if (req.body.includes) updateData.includes = JSON.parse(req.body.includes);

//     const experience = await Experience.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//     if (!experience)
//       return res.status(404).json({ message: "Experience not found" });

//     res.json({ message: "Experience updated successfully", experience });
//   } catch (error) {
//     console.error("Error updating experience:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 STEP 1: Load existing experience
    const existingExperience = await Experience.findById(id);
    if (!existingExperience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    const oldDestinationId = existingExperience.destination?.toString();
    const oldRegionId = existingExperience.region?.toString();

    const newDestinationId = req.body.destinationId;
    const newRegionId = req.body.regionId;

    // 🔹 STEP 2: If destination/region changed → sync Destination document
    if (
      newDestinationId &&
      newRegionId &&
      (oldDestinationId !== newDestinationId || oldRegionId !== newRegionId)
    ) {
      // ❌ remove from old region
      if (oldRegionId) {
        await Destination.updateOne(
          { "regions._id": oldRegionId },
          { $pull: { "regions.$.experiences": existingExperience._id } }
        );
      }

      // ✅ add to new region
      await Destination.updateOne(
        { _id: newDestinationId, "regions._id": newRegionId },
        { $addToSet: { "regions.$.experiences": existingExperience._id } }
      );

      existingExperience.destination = newDestinationId;
      existingExperience.region = newRegionId;
    }

    /* ---------- Handle uploads ---------- */
    if (req.files?.bannerImage?.[0]) {
      existingExperience.bannerImage = req.files.bannerImage[0].path;
    }

    if (req.files?.galleryImages) {
      existingExperience.gallery = {
        description: req.body.galleryDescription,
        images: req.files.galleryImages.map((f) => ({ image: f.path })),
      };
    }

    /* ---------- Parse JSON fields ---------- */
    if (req.body.experienceInfo)
      existingExperience.experienceInfo = JSON.parse(req.body.experienceInfo);

    if (req.body.overview)
      existingExperience.overview = JSON.parse(req.body.overview);

    // if (req.body.includes)
    //   existingExperience.includes = JSON.parse(req.body.includes);

    if (req.body.includes) {
  const incomingIncludes = JSON.parse(req.body.includes);
  const includeIcons = req.files?.includeIcons?.map((f) => f.path) || [];

  existingExperience.includes = incomingIncludes.map((inc, index) => ({
    name: inc.name,
    icon:
      includeIcons[index] ||
      existingExperience.includes[index]?.icon || // ✅ KEEP OLD ICON
      null,
  }));
}


    if (req.body.gameDrives)
      existingExperience.gameDrives = JSON.parse(req.body.gameDrives);

    if (req.body.highlights)
      existingExperience.highlights = JSON.parse(req.body.highlights);

    if (req.body.bannerTitle)
      existingExperience.bannerTitle = req.body.bannerTitle;

    if (req.body.bannerDescription)
      existingExperience.bannerDescription = req.body.bannerDescription;

    // 🔹 STEP 3: Save
    const updatedExperience = await existingExperience.save();

    res.json({
      message: "Experience updated successfully",
      experience: updatedExperience,
    });
  } catch (error) {
    console.error("Error updating experience:", error);
    res.status(500).json({ message: error.message });
  }
};


// ✅ DELETE Experience (unlink from destination region)
export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const experience = await Experience.findByIdAndDelete(id);
    if (!experience)
      return res.status(404).json({ message: "Experience not found" });

    // ✅ Unlink from any destination region
    // await Destination.updateMany(
    //   { "regions.experiences": id },
    //   { $pull: { "regions.$.experiences": id } }
    // );

    await Destination.updateMany(
  { "regions.experiences": id },
  { $pull: { "regions.$[].experiences": id } }
);


    res.json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting experience:", error);
    res.status(500).json({ message: error.message });
  }
};
