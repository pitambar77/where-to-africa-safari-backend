import Destination from "../models/Botswana/Destination.js";
import Trip from "../models/Botswana/Trip.js";
import Experience from "../models/Botswana/Experience.js";
import Accommodation from "../models/accomodationModels/accommodationModel.js";
import SafariBlog from "../models/Blog/SafariBlog.js";

export const getSitemapData = async (req, res) => {
  try {
    const [destinations, trips, experiences, accommodations, blogs] =
      await Promise.all([
        // Destinations + Regions
        Destination.find({}, "slug updatedAt regions").lean(),

        // Trips
        Trip.find({}, "slug updatedAt destination region").lean(),

        // Experiences
        Experience.find({}, "slug updatedAt").lean(),

        // Accommodations
        Accommodation.find({}, "slug updatedAt").lean(),

        // Blogs
        SafariBlog.find({}, "slug updatedAt").lean(),
      ]);

    // ----------------------------------------
    // Static Pages
    // ----------------------------------------

    const staticPages = [
      {
        path: "/",
      },
      {
        path: "/about-us",
      },
      {
        path: "/conservation",
      },
      {
        path: "/contact-us",
      },
      {
        path: "/experiences",
      },
      {
        path: "/accommodations",
      },
      {
        path: "/packages",
      },
      {
        path: "/privacy-policy",
      },
    ];

    // ----------------------------------------
    // Regions
    // ----------------------------------------

    const regions = [];

    destinations.forEach((destination) => {
      if (!destination.regions) return;

      destination.regions.forEach((region) => {
        if (!region.slug) return;

        regions.push({
          slug: region.slug,
          destinationSlug: destination.slug,
          updatedAt: region.updatedAt || destination.updatedAt,
        });
      });
    });

    // ----------------------------------------
    // Counts
    // ----------------------------------------

    const counts = {
      staticPages: staticPages.length,
      destinations: destinations.length,
      regions: regions.length,
      trips: trips.length,
      experiences: experiences.length,
      accommodations: accommodations.length,
      blogs: blogs.length,

      total:
        staticPages.length +
        destinations.length +
        regions.length +
        trips.length +
        experiences.length +
        accommodations.length +
        blogs.length,
    };

    // ----------------------------------------
    // Response
    // ----------------------------------------

    res.status(200).json({
      staticPages,
      destinations,
      regions,
      trips,
      experiences,
      accommodations,
      blogs,
      counts,
    });
  } catch (error) {
    console.error("Sitemap error:", error);

    res.status(500).json({
      message: "Failed to fetch sitemap data",
      error: error.message,
    });
  }
};
