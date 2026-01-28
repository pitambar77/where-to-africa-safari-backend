




// // ✅ CREATE Experience and link it to Destination
// // export const createExperience = async (req, res) => {
// //   try {
// //     const {
// //       destinationId, // 👈 You must send this from frontend
// //       bannerTitle,
// //       bannerDescription,
// //       experienceInfo,
// //       overview,
// //       includes,
// //       gameDrives,
// //       highlights,
// //       galleryDescription,
// //     } = req.body;

// //     const bannerImage = req.files?.bannerImage
// //       ? req.files.bannerImage[0].path
// //       : null;

// //     const galleryImages = req.files?.galleryImages
// //       ? req.files.galleryImages.map((file) => ({ image: file.path }))
// //       : [];

// //     // ✅ Create new Experience
// //     const experience = await Experience.create({
// //       bannerImage,
// //       bannerTitle,
// //       bannerDescription,
// //       experienceInfo: JSON.parse(experienceInfo),
// //       overview: JSON.parse(overview),
// //       includes: JSON.parse(includes),
// //       gameDrives: JSON.parse(gameDrives),
// //       highlights: JSON.parse(highlights),
// //       gallery: { description: galleryDescription, images: galleryImages },
// //     });

// //     // ✅ Link Experience to Destination (if destinationId provided)
// //     if (destinationId) {
// //       await Destination.findByIdAndUpdate(destinationId, {
// //         $push: { experience: experience._id },
// //       });
// //     }

// //     res.status(201).json({
// //       message: "Experience created successfully",
// //       experience,
// //     });
// //   } catch (error) {
// //     console.error("Error creating experience:", error);
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// // image store in clodinary of game drive

// // export const createExperience = async (req, res) => {
// //   try {
// //     const {
// //       destinationId,
// //       bannerTitle,
// //       bannerDescription,
// //       experienceInfo,
// //       overview,
// //       includes,
// //       gameDrives,
// //       highlights,
// //       galleryDescription,
// //     } = req.body;

// //     // ✅ Upload banner image
// //     const bannerImage = req.files?.bannerImage
// //       ? req.files.bannerImage[0].path
// //       : null;

// //     // ✅ Upload gallery images
// //     const galleryImages = req.files?.galleryImages
// //       ? req.files.galleryImages.map((file) => ({ image: file.path }))
// //       : [];

// //     // ✅ Upload game drive images (Cloudinary)
// //     // Expecting files under field name `gameDriveImages`
// //     const gameDriveImages = req.files?.gameDriveImages
// //       ? req.files.gameDriveImages.map((file) => file.path)
// //       : [];

// //     // ✅ Parse game drive data
// //     let parsedGameDrives = [];
// //     if (gameDrives) {
// //       const drives = JSON.parse(gameDrives);
// //       parsedGameDrives = drives.map((drive, index) => ({
// //         ...drive,
// //         image: gameDriveImages[index] || drive.image || null,
// //       }));
// //     }

// //     // ✅ Create new Experience
// //     const experience = await Experience.create({
// //       bannerImage,
// //       bannerTitle,
// //       bannerDescription,
// //       experienceInfo: JSON.parse(experienceInfo),
// //       overview: JSON.parse(overview),
// //       includes: JSON.parse(includes),
// //       gameDrives: parsedGameDrives,
// //       highlights: JSON.parse(highlights),
// //       gallery: { description: galleryDescription, images: galleryImages },
// //     });

// //     // ✅ Link Experience to Destination
// //     if (destinationId) {
// //       await Destination.findByIdAndUpdate(destinationId, {
// //         $push: { experience: experience._id },
// //       });
// //     }

// //     res.status(201).json({
// //       message: "Experience created successfully",
// //       experience,
// //     });
// //   } catch (error) {
// //     console.error("Error creating experience:", error);
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// // image store in clodinary of game drive and highlights

// import Experience from "../../models/Botswana/Experience.js";
// import Destination from "../../models/Botswana/Destination.js"; // ✅ Add this import
// import cloudinary from "../../config/cloudinary.js";

// export const createExperience = async (req, res) => {
//   try {
//     const {
//       destinationId,
//       bannerTitle,
//       bannerDescription,
//       experienceInfo,
//       overview,
//       includes,
//       gameDrives,
//       highlights,
//       galleryDescription,
//     } = req.body;

//     // ✅ Upload banner image
//     const bannerImage = req.files?.bannerImage
//       ? req.files.bannerImage[0].path
//       : null;

//     // ✅ Upload gallery images
//     const galleryImages = req.files?.galleryImages
//       ? req.files.galleryImages.map((file) => ({ image: file.path }))
//       : [];

//     // ✅ Upload game drive images
//     const gameDriveImages = req.files?.gameDriveImages
//       ? req.files.gameDriveImages.map((file) => file.path)
//       : [];

//     // ✅ Upload highlight images
//     const highlightImages = req.files?.highlightImages
//       ? req.files.highlightImages.map((file) => file.path)
//       : [];

//     // ✅ Parse and merge game drive data
//     let parsedGameDrives = [];
//     if (gameDrives) {
//       const drives = JSON.parse(gameDrives);
//       parsedGameDrives = drives.map((drive, index) => ({
//         ...drive,
//         image: gameDriveImages[index] || drive.image || null,
//       }));
//     }

//     // ✅ Parse and merge highlight data
//     let parsedHighlights = [];
//     if (highlights) {
//       const hlData = JSON.parse(highlights);
//       parsedHighlights = hlData.map((item, index) => ({
//         ...item,
//         image: highlightImages[index] || item.image || null,
//       }));
//     }

//     // ✅ Create Experience document
//     const experience = await Experience.create({
//       bannerImage,
//       bannerTitle,
//       bannerDescription,
//       experienceInfo: JSON.parse(experienceInfo),
//       overview: JSON.parse(overview),
//       includes: JSON.parse(includes),
//       gameDrives: parsedGameDrives,
//       highlights: parsedHighlights,
//       gallery: { description: galleryDescription, images: galleryImages },
//     });

//     // ✅ Link Experience to Destination
//     if (destinationId) {
//       await Destination.findByIdAndUpdate(destinationId, {
//         $push: { experience: experience._id },
//       });
//     }

//     res.status(201).json({
//       message: "Experience created successfully",
//       experience,
//     });
//   } catch (error) {
//     console.error("Error creating experience:", error);
//     res.status(500).json({ message: error.message });
//   }
// };


// // ✅ GET All Experiences (optionally populate Destination)
// export const getAllExperiences = async (req, res) => {
//   try {
//     const experiences = await Experience.find().populate({
//       path: "destinationId",
//       select: "name slug hero", // Optional fields
//     });
//     res.json(experiences);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ✅ UPDATE Experience
// export const updateExperience = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     if (req.files?.bannerImage) {
//       updateData.bannerImage = req.files.bannerImage[0].path;
//     }

//     if (req.files?.galleryImages) {
//       updateData.gallery = {
//         description: req.body.galleryDescription,
//         images: req.files.galleryImages.map((f) => ({ image: f.path })),
//       };
//     }

//     const experience = await Experience.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//     if (!experience) {
//       return res.status(404).json({ message: "Experience not found" });
//     }

//     res.json({
//       message: "Experience updated successfully",
//       experience,
//     });
//   } catch (error) {
//     console.error("Error updating experience:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ✅ DELETE Experience (and unlink from Destination)
// export const deleteExperience = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Remove experience
//     const experience = await Experience.findByIdAndDelete(id);
//     if (!experience) {
//       return res.status(404).json({ message: "Experience not found" });
//     }

//     // ✅ Remove reference from Destination
//     await Destination.updateMany(
//       { experience: id },
//       { $pull: { experience: id } }
//     );

//     res.json({ message: "Experience deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting experience:", error);
//     res.status(500).json({ message: error.message });
//   }
// };


// // ✅ GET Experience by ID
// export const getExperienceById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find experience by ID and populate optional destination
//     const experience = await Experience.findById(id).populate({
//       path: "destinationId",
//       select: "name slug hero",
//     });

//     if (!experience) {
//       return res.status(404).json({ message: "Experience not found" });
//     }

//     res.status(200).json(experience);
//   } catch (error) {
//     console.error("Error fetching experience by ID:", error);
//     res.status(500).json({ message: error.message });
//   }
// };


// region by destiinationId or regionsId

import Experience from "../../models/Botswana/Experience.js";
import Destination from "../../models/Botswana/Destination.js";
import cloudinary from "../../config/cloudinary.js";

// ✅ CREATE Experience (linked to destination & region)
// export const createExperience = async (req, res) => {
//   try {
//     const {
//       destinationId,
//       regionSlug,
//       bannerTitle,
//       bannerDescription,
//       experienceInfo,
//       overview,
//       includes,
//       gameDrives,
//       highlights,
//       galleryDescription,
//     } = req.body;

//     // ✅ Handle uploads
//     const bannerImage = req.files?.bannerImage?.[0]?.path || null;
//     const galleryImages = req.files?.galleryImages?.map((f) => ({ image: f.path })) || [];

//     // ✅ Parse and merge gameDrives
//     let parsedGameDrives = [];
//     if (gameDrives) {
//       const drives = JSON.parse(gameDrives);
//       const driveImages = req.files?.gameDriveImages?.map((f) => f.path) || [];
//       parsedGameDrives = drives.map((drive, i) => ({
//         ...drive,
//         image: driveImages[i] || drive.image || null,
//       }));
//     }

//     // ✅ Parse and merge highlights
//     let parsedHighlights = [];
//     if (highlights) {
//       const hlData = JSON.parse(highlights);
//       const hlImages = req.files?.highlightImages?.map((f) => f.path) || [];
//       parsedHighlights = hlData.map((h, i) => ({
//         ...h,
//         image: hlImages[i] || h.image || null,
//       }));
//     }

//     // ✅ Create Experience document
//     const experience = await Experience.create({
//       bannerImage,
//       bannerTitle,
//       bannerDescription,
//       experienceInfo: JSON.parse(experienceInfo),
//       overview: JSON.parse(overview),
//       includes: JSON.parse(includes),
//       gameDrives: parsedGameDrives,
//       highlights: parsedHighlights,
//       gallery: { description: galleryDescription, images: galleryImages },
//     });

//     // ✅ Link to destination’s region
//     if (destinationId && regionSlug) {
//       await Destination.updateOne(
//         { _id: destinationId, "regions.slug": regionSlug },
//         { $push: { "regions.$.experiences": experience._id } }
//       );
//     }

//     res.status(201).json({
//       message: "Experience created successfully",
//       experience,
//     });
//   } catch (error) {
//     console.error("Error creating experience:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

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
export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    // ✅ Handle reuploads
    if (req.files?.bannerImage?.[0]) {
      updateData.bannerImage = req.files.bannerImage[0].path;
    }

    if (req.files?.galleryImages) {
      updateData.gallery = {
        description: req.body.galleryDescription,
        images: req.files.galleryImages.map((f) => ({ image: f.path })),
      };
    }

    // ✅ Rebuild highlights/gameDrives if updated
    if (req.body.highlights) updateData.highlights = JSON.parse(req.body.highlights);
    if (req.body.gameDrives) updateData.gameDrives = JSON.parse(req.body.gameDrives);
    if (req.body.experienceInfo) updateData.experienceInfo = JSON.parse(req.body.experienceInfo);
    if (req.body.overview) updateData.overview = JSON.parse(req.body.overview);
    if (req.body.includes) updateData.includes = JSON.parse(req.body.includes);

    const experience = await Experience.findByIdAndUpdate(id, updateData, { new: true });

    if (!experience) return res.status(404).json({ message: "Experience not found" });

    res.json({ message: "Experience updated successfully", experience });
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
    if (!experience) return res.status(404).json({ message: "Experience not found" });

    // ✅ Unlink from any destination region
    await Destination.updateMany(
      { "regions.experiences": id },
      { $pull: { "regions.$.experiences": id } }
    );

    res.json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting experience:", error);
    res.status(500).json({ message: error.message });
  }
};
