import express from "express";

import blogUpload from "../middleware/blogUpload.js";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "../controller/blogController/blogCategoryController.js";

const router = express.Router();

/* ------------------------------------------
   Create Category
------------------------------------------ */

router.post(
  "/",
  blogUpload.single("image"),
  createCategory
);

/* ------------------------------------------
   Get All Categories
------------------------------------------ */

router.get("/", getCategories);

/* ------------------------------------------
   Get Category By ID
------------------------------------------ */

router.get("/:id", getCategoryById);

/* ------------------------------------------
   Update Category
------------------------------------------ */

router.put(
  "/:id",
  blogUpload.single("image"),
  updateCategory
);

/* ------------------------------------------
   Toggle Category Status
------------------------------------------ */

router.patch(
  "/:id/status",
  toggleCategoryStatus
);

/* ------------------------------------------
   Delete Category
------------------------------------------ */

router.delete("/:id", deleteCategory);

export default router;