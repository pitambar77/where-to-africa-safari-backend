import express from "express";

import blogUpload from "../middleware/blogUpload.js";

import {
  createAuthor,
  getAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
  toggleAuthorStatus,
} from "../controller/blogController/blogAuthorController.js";

const router = express.Router();

/* ------------------------------------------
   Create Author
------------------------------------------ */

router.post(
  "/",
  blogUpload.single("profileImage"),
  createAuthor
);

/* ------------------------------------------
   Get All Authors
------------------------------------------ */

router.get("/", getAuthors);

/* ------------------------------------------
   Get Author By ID
------------------------------------------ */

router.get("/:id", getAuthorById);

/* ------------------------------------------
   Update Author
------------------------------------------ */

router.put(
  "/:id",
  blogUpload.single("profileImage"),
  updateAuthor
);

/* ------------------------------------------
   Toggle Author Status
------------------------------------------ */

router.patch(
  "/:id/status",
  toggleAuthorStatus
);

/* ------------------------------------------
   Delete Author
------------------------------------------ */

router.delete("/:id", deleteAuthor);

export default router;