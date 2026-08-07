import express from "express";

import blogUpload from "../middleware/blogUpload.js";

import {
  uploadMedia,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogs,
  getBlogById,
  getBlogBySlug,
  getFeaturedBlogs,
  getRelatedBlogs,
  toggleFeatured,
  updateStatus,
} from "../controller/blogController/blogController.js";

const router = express.Router();

/* -----------------------------
   Upload Image / Video
----------------------------- */

router.post("/upload-media", blogUpload.single("media"), uploadMedia);

/* -----------------------------
   Create Blog
----------------------------- */

router.post(
  "/",
  blogUpload.fields([
    {
      name: "bannerImage",
      maxCount: 1,
    },
  ]),
  createBlog
);

/* -----------------------------
   Update Blog
----------------------------- */

router.put(
  "/:id",
  blogUpload.fields([
    {
      name: "bannerImage",
      maxCount: 1,
    },
  ]),
  updateBlog
);

/* -----------------------------
   Get Blogs
----------------------------- */

router.get("/", getBlogs);

router.get("/featured", getFeaturedBlogs);

/* -----------------------------
   Get Single Blog
----------------------------- */

router.get("/id/:id", getBlogById);

router.get("/:slug/related", getRelatedBlogs);
router.get("/:slug", getBlogBySlug);

/* -----------------------------
   Featured / Status
----------------------------- */

router.patch("/:id/featured", toggleFeatured);

router.patch("/:id/status", updateStatus);

/* -----------------------------
   Delete Blog
----------------------------- */

router.delete("/:id", deleteBlog);

export default router;
