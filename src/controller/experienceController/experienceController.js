// import Experience from "../../models/ExperienceModels/experienceModels.js";
// import cloudinary from "../../config/cloudinary.js";

// // Helper: extract Cloudinary public ID safely
// const getPublicId = (url) => {
//   if (!url) return null;
//   const parts = url.split("/");
//   const filename = parts.pop();
//   const folder = parts.pop();
//   return `${folder}/${filename.split(".")[0]}`;
// };


// export const createExperience = async (req, res) => {
//   try {
//     const data = JSON.parse(req.body.data);

//     // Banner
//     if (req.files?.bannerImage?.[0]) {
//       data.bannerImage = req.files.bannerImage[0].path;
//     }

//     // Gallery Images
//     if (req.files?.galleryImages) {
//       data.gallery = {
//         ...data.gallery,
//         images: req.files.galleryImages.map((file) => ({
//           name: file.originalname,
//           image: file.path,
//         })),
//       };
//     }

//     // Game Drive Images
//     if (req.files?.gameDriveImages) {
//       data.gameDrives = data.gameDrives.map((drive, i) => ({
//         ...drive,
//         image: req.files.gameDriveImages[i]
//           ? req.files.gameDriveImages[i].path
//           : drive.image || "",
//       }));
//     }

//     // Highlight Images
//     if (req.files?.highlightImages) {
//       data.highlights = data.highlights.map((h, i) => ({
//         ...h,
//         image: req.files.highlightImages[i]
//           ? req.files.highlightImages[i].path
//           : h.image || "",
//       }));
//     }

//     const newExp = new Experience(data);
//     await newExp.save();
//     res.status(201).json({ success: true, experience: newExp });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// // ✅ GET ALL EXPERIENCES
// export const getAllExperiences = async (req, res) => {
//   try {
//     const experiences = await Experience.find().sort({ createdAt: -1 });
//     res.status(200).json(experiences);
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ GET SINGLE EXPERIENCE
// export const getExperienceById = async (req, res) => {
//   try {
//     const exp = await Experience.findById(req.params.id);
//     if (!exp) return res.status(404).json({ message: "Not found" });
//     res.json(exp);
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // update

// // export const updateExperience = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const exp = await Experience.findById(id);
// //     if (!exp) return res.status(404).json({ message: "Experience not found" });

// //     const data = JSON.parse(req.body.data || "{}");

// //     // ✅ Banner Update (optional)
// //     if (req.files?.bannerImage?.[0]) {
// //       if (exp.bannerImage) {
// //         const publicId = getPublicId(exp.bannerImage);
// //         if (publicId) await cloudinary.uploader.destroy(publicId);
// //       }
// //       data.bannerImage = req.files.bannerImage[0].path;
// //     }

// //     // ✅ Gallery Image Append
// //     if (req.files?.galleryImages?.length) {
// //       const uploaded = [];
// //       for (const file of req.files.galleryImages) {
// //         uploaded.push({ name: file.originalname, image: file.path });
// //       }

// //       data.gallery = {
// //         description: data.gallery?.description || exp.gallery.description,
// //         images: [...(exp.gallery?.images || []), ...uploaded],
// //       };
// //     }

// //     // ✅ Game Drive images
// //     // if (req.files?.gameDriveImages?.length) {
// //     //   exp.gameDrives.forEach(async (drive, i) => {
// //     //     const file = req.files.gameDriveImages[i];
// //     //     if (file) {
// //     //       if (drive.image) {
// //     //         const publicId = getPublicId(drive.image);
// //     //         if (publicId) await cloudinary.uploader.destroy(publicId);
// //     //       }
// //     //       drive.image = file.path;
// //     //     }
// //     //   });
// //     //   await exp.save();
// //     // }

// //     if (req.files?.gameDriveImages?.length) {
// //   for (let i = 0; i < exp.gameDrives.length; i++) {
// //     const file = req.files.gameDriveImages[i];
// //     if (file) {
// //       const drive = exp.gameDrives[i];
// //       if (drive.image) {
// //         const publicId = getPublicId(drive.image);
// //         if (publicId) await cloudinary.uploader.destroy(publicId);
// //       }
// //       drive.image = file.path;
// //     }
// //   }
// //   await exp.save();
// // }


// //     // ✅ Highlight images
// //     // if (req.files?.highlightImages?.length) {
// //     //   exp.highlights.forEach(async (h, i) => {
// //     //     const file = req.files.highlightImages[i];
// //     //     if (file) {
// //     //       if (h.image) {
// //     //         const publicId = getPublicId(h.image);
// //     //         if (publicId) await cloudinary.uploader.destroy(publicId);
// //     //       }
// //     //       h.image = file.path;
// //     //     }
// //     //   });
// //     //   await exp.save();
// //     // }

// //     if (req.files?.highlightImages?.length) {
// //   for (let i = 0; i < exp.highlights.length; i++) {
// //     const file = req.files.highlightImages[i];
// //     const highlight = exp.highlights[i];

// //     if (file && highlight) {
// //       if (highlight.image) {
// //         const publicId = getPublicId(highlight.image);
// //         if (publicId) {
// //           try {
// //             await cloudinary.uploader.destroy(publicId);
// //           } catch (error) {
// //             console.error("Error deleting old highlight image:", error.message);
// //           }
// //         }
// //       }
// //       highlight.image = file.path;
// //     }
// //   }

// //   await exp.save();
// // }


// //     // ✅ Merge other fields (text, titles, etc.)
// //     const updated = await Experience.findByIdAndUpdate(id, { $set: data }, { new: true });

// //     res.json({ success: true, experience: updated });
// //   } catch (error) {
// //     console.error("❌ UPDATE EXPERIENCE ERROR:", error);
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// export const updateExperience = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const exp = await Experience.findById(id);
//     if (!exp) return res.status(404).json({ message: "Experience not found" });

//     const data = JSON.parse(req.body.data || "{}");

//     // ✅ Update Banner
//     if (req.files?.bannerImage?.[0]) {
//       if (exp.bannerImage) {
//         const publicId = getPublicId(exp.bannerImage);
//         if (publicId) await cloudinary.uploader.destroy(publicId);
//       }
//       exp.bannerImage = req.files.bannerImage[0].path;
//     }

//     // ✅ Gallery Images (append)
//     if (req.files?.galleryImages?.length) {
//       const uploaded = req.files.galleryImages.map((file) => ({
//         name: file.originalname,
//         image: file.path,
//       }));

//       exp.gallery = {
//         description: data.gallery?.description || exp.gallery.description,
//         images: [...(exp.gallery?.images || []), ...uploaded],
//       };
//     } else if (data.gallery?.description) {
//       exp.gallery.description = data.gallery.description;
//     }

//     // ✅ Game Drive Images
//     if (req.files?.gameDriveImages?.length) {
//       for (let i = 0; i < exp.gameDrives.length; i++) {
//         const file = req.files.gameDriveImages[i];
//         if (file) {
//           const drive = exp.gameDrives[i];
//           if (drive.image) {
//             const publicId = getPublicId(drive.image);
//             if (publicId) await cloudinary.uploader.destroy(publicId);
//           }
//           drive.image = file.path;
//         }
//       }
//     }

//     // ✅ Highlight Images
//     if (req.files?.highlightImages?.length) {
//       for (let i = 0; i < exp.highlights.length; i++) {
//         const file = req.files.highlightImages[i];
//         if (file) {
//           const highlight = exp.highlights[i];
//           if (highlight.image) {
//             const publicId = getPublicId(highlight.image);
//             if (publicId) await cloudinary.uploader.destroy(publicId);
//           }
//           highlight.image = file.path;
//         }
//       }
//     }

//     // ✅ Merge other non-file fields
//     for (const [key, value] of Object.entries(data)) {
//       if (["gallery", "gameDrives", "highlights"].includes(key)) continue;
//       exp[key] = value;
//     }

//     // ✅ Save final result
//     const updated = await exp.save();

//     res.json({ success: true, experience: updated });
//   } catch (error) {
//     console.error("❌ UPDATE EXPERIENCE ERROR:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



// export const deleteExperience = async (req, res) => {
//   try {
//     const exp = await Experience.findById(req.params.id);
//     if (!exp) return res.status(404).json({ message: "Not found" });

//     // Delete banner image
//     if (exp.bannerImage) {
//       const publicId = getPublicId(exp.bannerImage);
//       if (publicId) await cloudinary.uploader.destroy(publicId);
//     }

//     // Delete gallery images
//     if (exp.gallery?.images?.length) {
//       for (const img of exp.gallery.images) {
//         const publicId = getPublicId(img.image);
//         if (publicId) await cloudinary.uploader.destroy(publicId);
//       }
//     }

//     await exp.deleteOne();
//     res.json({ success: true, message: "Experience deleted successfully" });
//   } catch (error) {
//     console.error("❌ DELETE EXPERIENCE ERROR:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ✅ DELETE SINGLE GALLERY IMAGE

// // Delete gallery image
// export const deleteGalleryImage = async (req, res) => {
//   try {
//     const { id, imageId } = req.params;
//     const exp = await Experience.findById(id);
//     if (!exp) return res.status(404).json({ message: "Experience not found" });

//     const img = exp.gallery.images.id(imageId);
//     if (!img) return res.status(404).json({ message: "Image not found" });

//     const publicId = getPublicId(img.image);
//     if (publicId) await cloudinary.uploader.destroy(publicId);

//     img.deleteOne();
//     await exp.save();
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Delete highlight image
// export const deleteHighlightImage = async (req, res) => {
//   try {
//     const { id, highlightId } = req.params;
//     const exp = await Experience.findById(id);
//     if (!exp) return res.status(404).json({ message: "Experience not found" });

//     const highlight = exp.highlights.id(highlightId);
//     if (!highlight) return res.status(404).json({ message: "Highlight not found" });

//     const publicId = getPublicId(highlight.image);
//     if (publicId) await cloudinary.uploader.destroy(publicId);

//     highlight.deleteOne();
//     await exp.save();
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Delete game drive image
// export const deleteGameDriveImage = async (req, res) => {
//   try {
//     const { id, driveId } = req.params;
//     const exp = await Experience.findById(id);
//     if (!exp) return res.status(404).json({ message: "Experience not found" });

//     const drive = exp.gameDrives.id(driveId);
//     if (!drive) return res.status(404).json({ message: "Game drive not found" });

//     const publicId = getPublicId(drive.image);
//     if (publicId) await cloudinary.uploader.destroy(publicId);

//     drive.deleteOne();
//     await exp.save();
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// controllers/experienceController.js
import Experience from "../models/Experience.js";
import Destination from "../models/Destination.js";
import { deleteFromCloudinary } from "../utils/cloudinaryHelper.js";

/**
 * Create Experience
 * Supports many nested structures; expects JSON fields for most arrays/objects.
 * Upload fields by names:
 * - bannerImage (single)
 * - galleryImages (multiple)
 * - highlightsImages (multiple) -> client must pair highlights JSON with images by index
 * - gameDriveImages (multiple) -> same pairing expectation
 */
export const createExperience = async (req, res, next) => {
  try {
    // Read fields
    const {
      bannerTitle,
      bannerDescription,
      experienceInfo,
      overview,
      includes,
      gameDrives,
      highlights,
      gallery,
      destinationId, // optional: to link experience to a destination
    } = req.body;

    const exp = new Experience({
      bannerTitle,
      bannerDescription,
      experienceInfo: experienceInfo ? JSON.parse(experienceInfo) : {},
      overview: overview ? JSON.parse(overview) : {},
      includes: includes ? JSON.parse(includes) : [],
      gameDrives: gameDrives ? JSON.parse(gameDrives) : [],
      highlights: highlights ? JSON.parse(highlights) : [],
      gallery: gallery ? JSON.parse(gallery) : { description: "", images: [] },
    });

    if (req.files && req.files.bannerImage && req.files.bannerImage[0]) {
      const f = req.files.bannerImage[0];
      exp.bannerImage = f.path;
    }

    // Map galleryImages
    if (req.files && req.files.galleryImages) {
      exp.gallery.images = req.files.galleryImages.map((f) => ({ name: f.originalname || "", image: f.path }));
    }

    // Map highlights images (pair by index)
    if (req.files && req.files.highlightsImages) {
      exp.highlights = exp.highlights.map((h, idx) => ({
        ...h,
        image: req.files.highlightsImages[idx] ? req.files.highlightsImages[idx].path : h.image || "",
      }));
    }

    // Map game drive images
    if (req.files && req.files.gameDriveImages) {
      exp.gameDrives = exp.gameDrives.map((g, idx) => ({
        ...g,
        image: req.files.gameDriveImages[idx] ? req.files.gameDriveImages[idx].path : g.image || "",
      }));
    }

    await exp.save();

    // optionally attach experience to destination
    if (destinationId) {
      await Destination.findByIdAndUpdate(destinationId, { $push: { experience: exp._id } });
    }

    res.status(201).json(exp);
  } catch (err) {
    next(err);
  }
};

export const getAllExperiences = async (req, res, next) => {
  try {
    const all = await Experience.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    next(err);
  }
};

export const getExperienceById = async (req, res, next) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: "Experience not found" });
    res.json(exp);
  } catch (err) {
    next(err);
  }
};

export const updateExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: "Experience not found" });

    // simple fields
    const updatable = [
      "bannerTitle",
      "bannerDescription",
      "experienceInfo",
      "overview",
      "includes",
      "gameDrives",
      "highlights",
      "gallery",
    ];
    updatable.forEach((k) => {
      if (req.body[k]) {
        exp[k] = typeof req.body[k] === "string" ? JSON.parse(req.body[k]) : req.body[k];
      }
    });

    if (req.files && req.files.bannerImage && req.files.bannerImage[0]) {
      // TODO: delete previous banner using stored publicId if available
      exp.bannerImage = req.files.bannerImage[0].path;
    }

    if (req.files && req.files.galleryImages) {
      exp.gallery.images = req.files.galleryImages.map((f) => ({ name: f.originalname || "", image: f.path }));
    }

    if (req.files && req.files.highlightsImages) {
      exp.highlights = exp.highlights.map((h, idx) => ({
        ...h,
        image: req.files.highlightsImages[idx] ? req.files.highlightsImages[idx].path : h.image || "",
      }));
    }

    if (req.files && req.files.gameDriveImages) {
      exp.gameDrives = exp.gameDrives.map((g, idx) => ({
        ...g,
        image: req.files.gameDriveImages[idx] ? req.files.gameDriveImages[idx].path : g.image || "",
      }));
    }

    await exp.save();
    res.json(exp);
  } catch (err) {
    next(err);
  }
};

export const deleteExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: "Experience not found" });

    // best-effort: delete used images by publicId if you stored them earlier
    // (we don't store publicId in current model, so skip.)

    // remove experience reference from destination(s) if any - this requires scanning Destinations that reference it
    await Destination.updateMany({ experience: exp._id }, { $pull: { experience: exp._id } });

    await exp.remove();
    res.json({ message: "Experience deleted" });
  } catch (err) {
    next(err);
  }
};



