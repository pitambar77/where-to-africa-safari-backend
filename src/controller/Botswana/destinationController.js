

import Destination from "../../models/Botswana/Destination.js";
import Trip from "../../models/Botswana/Trip.js";
import Experience from "../../models/Botswana/Experience.js";
import Accommodation from "../../models/accomodationModels/accommodationModel.js";
import { deleteFromCloudinary } from "../../utils/cloudinaryHelper.js";
import { slugify } from "../../utils/slugify.js";

// const mapImagesByIndex = (items, files, key = "image") => {
//   if (!files) return items;
//   return items.map((item, index) => ({
//     ...item,
//     [key]: files[index]?.path || item[key] || "",
//   }));
// };

const mapImagesBySlug = (regions, files) => {
  if (!files) return regions;

  const imageMap = {};

  files.forEach((file) => {
    const match = file.fieldname.match(/regionImages\[(.*)\]/);
    if (match) {
      imageMap[match[1]] = file.path;
    }
  });

  return regions.map((region) => ({
    ...region,
    image: imageMap[region.slug] || region.image || "",
  }));
};

// ✅ Create destination
export const createDestination = async (req, res, next) => {
  try {
    const { name } = req.body;
    const slug = slugify(name);

    const hero = req.body.hero ? JSON.parse(req.body.hero) : {};
    let regions = req.body.regions ? JSON.parse(req.body.regions) : [];

    /* Hero image */
    // if (req.files?.bannerImage?.[0]) {
    //   hero.bannerImage = req.files.bannerImage[0].path;
    // }
    const bannerFile = req.files?.find((f) => f.fieldname === "bannerImage");

    if (bannerFile) {
      hero.bannerImage = bannerFile.path;
    }

    /* Region images */
    // if (req.files?.regionImages) {
    //   regions = mapImagesByIndex(regions, req.files.regionImages);
    // }

    /* Region images (mapped by slug) */
    // if (req.files) {
    //   const regionImageFiles = req.files.filter((f) =>
    //     f.fieldname.startsWith("regionImages[")
    //   );

    //   regions = mapImagesBySlug(regions, regionImageFiles);
    // }

    const regionImageFiles = req.files?.filter((f) =>
      f.fieldname.startsWith("regionImages[")
    );

    regions = mapImagesBySlug(regions, regionImageFiles);

    /* Things To Do images */
    // if (req.files?.thingsTodoImages) {
    //   let imgIndex = 0;
    //   regions = regions.map((region) => ({
    //     ...region,
    //     thingstodo: region.thingstodo?.map((todo) => ({
    //       ...todo,
    //       section: todo.section?.map((sec) => ({
    //         ...sec,
    //         image: req.files.thingsTodoImages[imgIndex++]?.path || sec.image,
    //       })),
    //     })),
    //   }));
    // }

    const thingsTodoFiles = req.files?.filter((f) =>
      f.fieldname.startsWith("thingsTodoImages[")
    );

    if (thingsTodoFiles?.length) {
      const imageMap = {};

      thingsTodoFiles.forEach((file) => {
        const match = file.fieldname.match(
          /thingsTodoImages\[(.*)\]\[(\d+)\]\[(\d+)\]/
        );
        if (!match) return;

        const [, regionSlug, todoIndex, sectionIndex] = match;

        imageMap[`${regionSlug}-${todoIndex}-${sectionIndex}`] = file.path;
      });

      regions = regions.map((region) => ({
        ...region,
        thingstodo: region.thingstodo?.map((todo, tIdx) => ({
          ...todo,
          section: todo.section?.map((sec, sIdx) => ({
            ...sec,
            image: imageMap[`${region.slug}-${tIdx}-${sIdx}`] || sec.image,
          })),
        })),
      }));
    }

    const destination = await Destination.create({
      name,
      slug,
      hero,
      regions,
    });

    res.status(201).json(destination);
  } catch (err) {
    next(err);
  }
};

// ✅ Get all destinations (with regions & their linked items)
export const getAllDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find()
      .populate({
        path: "regions.trips",
        model: Trip,
      })
      .populate({
        path: "regions.experiences",
        model: Experience,
      })
      .populate({
        path: "regions.accommodations",
        model: Accommodation,
      })
      .sort({ createdAt: -1 });

    res.json(destinations);
  } catch (err) {
    next(err);
  }
};

// ✅ Get destination by slug (with nested data)
export const getDestinationBySlug = async (req, res, next) => {
  try {
    const dest = await Destination.findOne({ slug: req.params.slug })
      .populate({
        path: "regions.trips",
        model: Trip,
      })
      .populate({
        path: "regions.experiences",
        model: Experience,
      })
      .populate({
        path: "regions.accommodations",
        model: Accommodation,
      });

    if (!dest)
      return res.status(404).json({ message: "Destination not found" });

    res.json(dest);
  } catch (err) {
    next(err);
  }
};

// ✅ Get specific region by slug (within a destination)
export const getRegionBySlug = async (req, res, next) => {
  try {
    const { destinationSlug, regionSlug } = req.params;

    const destination = await Destination.findOne({ slug: destinationSlug })
      .populate({
        path: "regions.trips",
        model: Trip,
      })
      .populate({
        path: "regions.experiences",
        model: Experience,
      })
      .populate({
        path: "regions.accommodations",
        model: Accommodation,
      });

    if (!destination)
      return res.status(404).json({ message: "Destination not found" });

    const region = destination.regions.find((r) => r.slug === regionSlug);
    if (!region) return res.status(404).json({ message: "Region not found" });

    res.json(region);
  } catch (err) {
    next(err);
  }
};

// ✅ Update destination (including regions and hero)
export const updateDestination = async (req, res, next) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest)
      return res.status(404).json({ message: "Destination not found" });

    // if (req.body.name) dest.name = req.body.name;
    // if (req.body.slug) dest.slug = req.body.slug;

    if (req.body.name) {
  dest.name = req.body.name;
  dest.slug = slugify(req.body.name);
}


    /* Hero update */
    if (req.body.hero) {
      const hero = JSON.parse(req.body.hero);
      dest.hero = { ...dest.hero, ...hero };
    }

    // if (req.files?.bannerImage?.[0]) {
    //   if (dest.hero.bannerImage)
    //     await deleteFromCloudinary(dest.hero.bannerImage);
    //   dest.hero.bannerImage = req.files.bannerImage[0].path;
    // }

    const bannerFile = req.files?.find(
  (f) => f.fieldname === "bannerImage"
);

if (bannerFile) {
  if (dest.hero.bannerImage) {
    await deleteFromCloudinary(dest.hero.bannerImage);
  }
  dest.hero.bannerImage = bannerFile.path;
}


    /* Regions */
    if (req.body.regions) {
      let regions = JSON.parse(req.body.regions);

      // if (req.files?.regionImages) {
      //   regions = mapImagesByIndex(regions, req.files.regionImages);
      // }

      /* Region images (mapped by slug) */
      if (req.files) {
        const regionImageFiles = req.files.filter((f) =>
          f.fieldname.startsWith("regionImages[")
        );

        regions = mapImagesBySlug(regions, regionImageFiles);
      }

      // if (req.files?.thingsTodoImages) {
      //   let imgIndex = 0;
      //   regions = regions.map((region) => ({
      //     ...region,
      //     thingstodo: region.thingstodo?.map((todo) => ({
      //       ...todo,
      //       section: todo.section?.map((sec) => ({
      //         ...sec,
      //         image: req.files.thingsTodoImages[imgIndex++]?.path || sec.image,
      //       })),
      //     })),
      //   }));
      // }

      const thingsTodoFiles = req.files?.filter((f) =>
  f.fieldname.startsWith("thingsTodoImages[")
);

if (thingsTodoFiles?.length) {
  const imageMap = {};

  thingsTodoFiles.forEach((file) => {
    const match = file.fieldname.match(
      /thingsTodoImages\[(.*)\]\[(\d+)\]\[(\d+)\]/
    );
    if (!match) return;

    const [, regionSlug, todoIndex, sectionIndex] = match;

    imageMap[`${regionSlug}-${todoIndex}-${sectionIndex}`] = file.path;
  });

  regions = regions.map((region) => ({
    ...region,
    thingstodo: region.thingstodo?.map((todo, tIdx) => ({
      ...todo,
      section: todo.section?.map((sec, sIdx) => ({
        ...sec,
        image:
          imageMap[`${region.slug}-${tIdx}-${sIdx}`] || sec.image,
      })),
    })),
  }));
}


      // dest.regions = regions;
      // dest.regions = regions.map((newRegion) => {
      //   const oldRegion = dest.regions.find((r) => r.slug === newRegion.slug);

      //   return {
      //     ...oldRegion?.toObject(),
      //     ...newRegion,
      //   };
      // });
      const updatedRegions = regions.map((newRegion) => {
        const oldRegion = dest.regions.find((r) => r.slug === newRegion.slug);

        return oldRegion
          ? { ...oldRegion.toObject(), ...newRegion }
          : newRegion;
      });

      dest.regions = updatedRegions;
    }

    await dest.save();
    res.json(dest);
  } catch (err) {
    next(err);
  }
};

// ✅ Delete destination
// export const deleteDestination = async (req, res, next) => {
//   try {
//     const dest = await Destination.findById(req.params.id);
//     if (!dest)
//       return res.status(404).json({ message: "Destination not found" });

//     if (dest.hero?.bannerImage)
//       await deleteFromCloudinary(dest.hero.bannerImage);

//     dest.regions.forEach((region) => {
//       if (region.image) deleteFromCloudinary(region.image);

//       region.thingstodo?.forEach((todo) => {
//         todo.section?.forEach((sec) => {
//           if (sec.image) deleteFromCloudinary(sec.image);
//         });
//       });
//     });

//     dest.regions.forEach((oldRegion) => {
//   const stillExists = regions.find(
//     (r) => r.slug === oldRegion.slug
//   );

//   if (!stillExists && oldRegion.image) {
//     deleteFromCloudinary(oldRegion.image);
//   }
// });


//     await dest.deleteOne();
//     res.json({ message: "Destination deleted successfully" });
//   } catch (err) {
//     next(err);
//   }
// };

export const deleteDestination = async (req, res, next) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest)
      return res.status(404).json({ message: "Destination not found" });

    /* Delete hero image */
    if (dest.hero?.bannerImage) {
      await deleteFromCloudinary(dest.hero.bannerImage);
    }

    /* Delete region images */
    for (const region of dest.regions) {
      if (region.image) {
        await deleteFromCloudinary(region.image);
      }

      for (const todo of region.thingstodo || []) {
        for (const sec of todo.section || []) {
          if (sec.image) {
            await deleteFromCloudinary(sec.image);
          }
        }
      }
    }

    await dest.deleteOne();

    res.json({ message: "Destination deleted successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

