// import Trip from "../../models/Botswana/Trip.js";
// import Destination from "../../models/Botswana/Destination.js";

// // ✅ Helper to safely parse JSON or comma-separated values
// const safeParse = (value) => {
//   if (!value) return [];
//   try {
//     return JSON.parse(value);
//   } catch {
//     if (typeof value === "string")
//       return value.split(",").map((v) => v.trim()).filter(Boolean);
//     return [];
//   }
// };

// // ✅ CREATE Trip
// export const createTrip = async (req, res) => {
//   try {
//     const {
//       destinationId,
//       regionId,
//       title,
//       subtitle,
//       location,
//       duration,
//       price,
//       rating,
//       description,
//       itinerary,
//       overviewTitle,
//       overviewSubTitle,
//       overviewDescription,
//        aboutBooking,
//       requirements,
//       tripHighlights, // ✅ added here
//     } = req.body;

//     if (!destinationId || !regionId) {
//       return res.status(400).json({ message: "Destination and Region are required" });
//     }

//     // ✅ Handle image uploads
//     const image = req.files?.image?.[0]?.path || null;
//     const gallery = req.files?.gallery?.map((f) => ({
//       url: f.path,
//       publicId: f.filename,
//     })) || [];

//     const itineraryImages = req.files?.itineraryImages?.map((f) => f.path) || [];

//     // ✅ Parse itinerary JSON + attach images
//     const parsedItinerary = safeParse(itinerary).map((item, i) => ({
//       ...item,
//       image: itineraryImages[i] || item.image || null,
//     }));

// const tripHighlightImage = req.files?.tripHighlightImage?.[0]?.path || null;

// const parsedTripHighlights = safeParse(tripHighlights).map((item) => ({
//   ...item,
//   tripImage: tripHighlightImage || item.tripImage || null,
// }));

//     // ✅ Create Trip
//     const trip = await Trip.create({
//       destination: destinationId,
//       title,
//       subtitle,
//       location,
//       duration,
//       price,
//       rating,
//       description,
//       image,
//       gallery,
//       overviewTitle,
//       overviewSubTitle,
//       overviewDescription,
//        aboutBooking: safeParse(aboutBooking),
//       requirements: safeParse(requirements),
//       itinerary: parsedItinerary,
//       tripHighlights:parsedTripHighlights,

//     });

//     // ✅ Link Trip to region inside Destination
//     await Destination.updateOne(
//       { _id: destinationId, "regions._id": regionId },
//       { $push: { "regions.$.trips": trip._id } }
//     );

//     res.status(201).json({ message: "✅ Trip created successfully", trip });
//   } catch (err) {
//     console.error("❌ Error creating trip:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ GET All Trips
// export const getAllTrips = async (req, res) => {
//   try {
//     const trips = await Trip.find().populate("destination");
//     res.json(trips);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ GET Trip by ID
// export const getTripById = async (req, res) => {
//   try {
//     const trip = await Trip.findById(req.params.id).populate("destination");
//     if (!trip) return res.status(404).json({ message: "Trip not found" });
//     res.json(trip);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ UPDATE Trip
// export const updateTrip = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//      updateData.aboutBooking = safeParse(updateData.aboutBooking);
//     updateData.requirements = safeParse(updateData.requirements);
// // updateData.tripHighlights = safeParse(updateData.tripHighlights);

// if (updateData.tripHighlights) {
//   const tripHighlightImage = req.files?.tripHighlightImage?.[0]?.path || null;
//   const parsedTripHighlights = safeParse(updateData.tripHighlights).map((item) => ({
//     ...item,
//     tripImage: tripHighlightImage || item.tripImage || null,
//   }));
//   updateData.tripHighlights = parsedTripHighlights;
// }

//     // ✅ Update images if provided
//     if (req.files?.image?.length) {
//       updateData.image = req.files.image[0].path;
//     }
//     if (req.files?.gallery?.length) {
//       updateData.gallery = req.files.gallery.map((f) => ({
//         url: f.path,
//         publicId: f.filename,
//       }));
//     }

//     // ✅ Handle itinerary
//     if (updateData.itinerary) {
//       const itineraryImages = req.files?.itineraryImages?.map((f) => f.path) || [];
//       const parsedItinerary = safeParse(updateData.itinerary).map((item, i) => ({
//         ...item,
//         image: itineraryImages[i] || item.image || null,
//       }));
//       updateData.itinerary = parsedItinerary;
//     }

//     const updatedTrip = await Trip.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedTrip) return res.status(404).json({ message: "Trip not found" });

//     res.json({ message: "✅ Trip updated successfully", trip: updatedTrip });
//   } catch (err) {
//     console.error("❌ Error updating trip:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ DELETE Trip
// export const deleteTrip = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const trip = await Trip.findByIdAndDelete(id);
//     if (!trip) return res.status(404).json({ message: "Trip not found" });

//     // ✅ Unlink from regions
//     await Destination.updateMany(
//       { "regions.trips": id },
//       { $pull: { "regions.$[].trips": id } }
//     );

//     res.json({ message: "✅ Trip deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

//feb 1 sunday

import Trip from "../../models/Botswana/Trip.js";
import Destination from "../../models/Botswana/Destination.js";

/* =========================
   SAFE JSON PARSER
========================= */
const safeParse = (value) => {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

/* =========================
   CREATE TRIP
========================= */
export const createTrip = async (req, res) => {
  try {
    const {
      destinationId,
      regionId,
      title,
      subtitle,
      location,
      duration,
      price,
      rating,
      description,
      itinerary,
      overviewTitle,
      overviewSubTitle,
      overviewDescription,
      aboutBooking,
      requirements,
      tripHighlights,
    } = req.body;

    if (!destinationId || !regionId) {
      return res
        .status(400)
        .json({ message: "Destination and Region are required" });
    }

    /* ---------- Banner Image ---------- */
    const image = req.files?.image?.[0]?.path || null;

    /* ---------- Gallery Images ---------- */
    const gallery =
      req.files?.gallery?.map((f) => ({
        url: f.path,
        publicId: f.filename,
      })) || [];

    /* ---------- Itinerary ---------- */
    const itineraryImages =
      req.files?.itineraryImages?.map((f) => f.path) || [];
    const parsedItinerary = safeParse(itinerary).map((item, i) => ({
      ...item,
      image: itineraryImages[i] || null,
    }));

    /* ---------- Trip Highlights ---------- */
    const highlightImages =
      req.files?.tripHighlightImage?.map((f) => f.path) || [];
    const parsedTripHighlights = safeParse(tripHighlights).map((item, i) => ({
      title: item.title,
      description: item.description,
      status: item.status,
      tripHighlightImage: highlightImages[i] || null,
    }));

    /* ---------- Create Trip ---------- */
    const trip = await Trip.create({
      destination: destinationId,
      region: regionId, // ✅ ADD THIS
      title,
      subtitle,
      location,
      duration,
      price,
      rating,
      description,
      image,
      gallery,
      overviewTitle,
      overviewSubTitle,
      overviewDescription,
      aboutBooking: safeParse(aboutBooking),
      requirements: safeParse(requirements),
      itinerary: parsedItinerary,
      tripHighlights: parsedTripHighlights,
    });

    /* ---------- Attach to Region ---------- */
    await Destination.updateOne(
      { _id: destinationId, "regions._id": regionId },
      { $push: { "regions.$.trips": trip._id } }
    );

    res.status(201).json({ message: "Trip created successfully", trip });
  } catch (err) {
    console.error("CREATE TRIP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET ALL TRIPS
========================= */
export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate("destination");
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET TRIP BY ID
========================= */
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("destination");
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE TRIP
========================= */
export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // 🔹 STEP 2: Fetch existing trip
    const existingTrip = await Trip.findById(id);
    if (!existingTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // old references
    const oldDestinationId = existingTrip.destination?.toString();
    const oldRegionId = existingTrip.region?.toString();

    // new references (from frontend)
    const newDestinationId = updateData.destinationId;
    const newRegionId = updateData.regionId;

    // 🔹 STEP 3: Sync trip inside destination → region.trips[]
    if (
      newDestinationId &&
      newRegionId &&
      (oldDestinationId !== newDestinationId || oldRegionId !== newRegionId)
    ) {
      // ❌ Remove from old region
      if (oldRegionId) {
        await Destination.updateOne(
          { "regions._id": oldRegionId },
          { $pull: { "regions.$.trips": existingTrip._id } }
        );
      }

      // ✅ Add to new region
      await Destination.updateOne(
        { _id: newDestinationId, "regions._id": newRegionId },
        { $addToSet: { "regions.$.trips": existingTrip._id } }
      );

      // Update trip refs
      existingTrip.destination = newDestinationId;
      existingTrip.region = newRegionId;
    }

    /* ---------- Parse Q&A ---------- */
    updateData.aboutBooking = safeParse(updateData.aboutBooking);
    updateData.requirements = safeParse(updateData.requirements);

    /* ---------- Banner Image ---------- */
    if (req.files?.image?.length) {
      updateData.image = req.files.image[0].path;
    }

    /* ---------- Gallery (APPEND, NOT REPLACE) ---------- */
    // if (req.files?.gallery?.length) {
    //   updateData.$push = {
    //     gallery: {
    //       $each: req.files.gallery.map((f) => ({
    //         url: f.path,
    //         publicId: f.filename,
    //       })),
    //     },
    //   };
    // }

    if (req.files?.gallery?.length) {
  existingTrip.gallery.push(
    ...req.files.gallery.map((f) => ({
      url: f.path,
      publicId: f.filename,
    }))
  );
}


    /* ---------- Itinerary ---------- */
    // if (updateData.itinerary) {
    //   const itineraryImages = req.files?.itineraryImages?.map((f) => f.path) || [];
    //   updateData.itinerary = safeParse(updateData.itinerary).map((item, i) => ({
    //     ...item,
    //     // image: itineraryImages[i] || item.image || null,
    //     image: itineraryImages[i]?.path ?? item.image

    //   }));
    // }

    if (updateData.itinerary) {
      const itineraryImages = req.files?.itineraryImages || [];

      updateData.itinerary = safeParse(updateData.itinerary).map((item) => ({
        ...item,
        image:
          typeof item.imageIndex === "number"
            ? itineraryImages[item.imageIndex]?.path
            : item.image,
      }));
    }

    /* ---------- Trip Highlights ---------- */
    // if (updateData.tripHighlights) {
    //   const highlightImages = req.files?.tripHighlightImage?.map((f) => f.path) || [];
    //   updateData.tripHighlights = safeParse(updateData.tripHighlights).map((item, i) => ({
    //     title: item.title,
    //     description: item.description,
    //     status: item.status,
    //     tripHighlightImage: highlightImages[i] || item.tripHighlightImage || null,
    //   }));
    // }

    /* ---------- Trip Highlights ---------- */
    // if (updateData.tripHighlights) {
    //   const highlightImages = req.files?.tripHighlightImage || [];

    //   updateData.tripHighlights = safeParse(updateData.tripHighlights).map(
    //     (item, i) => ({
    //       title: item.title,
    //       description: item.description,
    //       status: item.status,
    //       tripHighlightImage:
    //         highlightImages[i]?.path ?? item.tripHighlightImage,
    //     })
    //   );
    // }

    if (updateData.tripHighlights) {
      const highlightImages = req.files?.tripHighlightImage || [];

      updateData.tripHighlights = safeParse(updateData.tripHighlights).map(
        (item) => ({
          title: item.title,
          description: item.description,
          status: item.status,
          tripHighlightImage:
            typeof item.imageIndex === "number"
              ? highlightImages[item.imageIndex]?.path
              : item.tripHighlightImage,
        })
      );
    }

    // const updatedTrip = await Trip.findByIdAndUpdate(id, updateData, {
    //   new: true,
    //   runValidators: true,
    // });

    // 🔹 STEP 5: Apply updates to trip
    Object.assign(existingTrip, updateData);
    const updatedTrip = await existingTrip.save();

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({ message: "Trip updated successfully", trip: updatedTrip });
  } catch (err) {
    console.error("UPDATE TRIP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE TRIP
========================= */
export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findByIdAndDelete(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    await Destination.updateMany(
      { "regions.trips": id },
      { $pull: { "regions.$[].trips": id } }
    );

    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
