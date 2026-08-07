import BlogAuthor from "../../models/Blog/BlogAuthor.js";

/* ------------------------------------------
   Create Author
------------------------------------------ */

export const createAuthor = async (req, res) => {
  try {
    const {
      name,
      designation,
      email,
      bio,
      facebook,
      instagram,
      twitter,
      linkedin,
      isActive,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Author name is required.",
      });
    }

    if (email) {
      const exists = await BlogAuthor.findOne({
        email: email.toLowerCase(),
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Author email already exists.",
        });
      }
    }

    const author = await BlogAuthor.create({
      name,
      designation: designation || "",
      email: email ? email.toLowerCase() : "",
      bio: bio || "",

      profileImage: req.file?.path || "",

      facebook: facebook || "",
      instagram: instagram || "",
      twitter: twitter || "",
      linkedin: linkedin || "",

      isActive:
        isActive === undefined
          ? true
          : isActive === true || isActive === "true",
    });

    return res.status(201).json({
      success: true,
      message: "Author created successfully.",
      author,
    });
  } catch (error) {
    console.error("Create Author Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------
   Get All Authors
------------------------------------------ */

export const getAuthors = async (req, res) => {
  try {
    const authors = await BlogAuthor.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: authors.length,
      authors,
    });
  } catch (error) {
    console.error("Get Authors Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------
   Get Author By ID
------------------------------------------ */

export const getAuthorById = async (req, res) => {
  try {
    const author = await BlogAuthor.findById(req.params.id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found.",
      });
    }

    return res.status(200).json({
      success: true,
      author,
    });
  } catch (error) {
    console.error("Get Author Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------
   Update Author
------------------------------------------ */

export const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await BlogAuthor.findById(id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found.",
      });
    }

    if (
      req.body.email &&
      req.body.email.toLowerCase() !== author.email
    ) {
      const exists = await BlogAuthor.findOne({
        email: req.body.email.toLowerCase(),
        _id: { $ne: id },
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }

      author.email = req.body.email.toLowerCase();
    }

    if (req.body.name !== undefined)
      author.name = req.body.name;

    if (req.body.designation !== undefined)
      author.designation = req.body.designation;

    if (req.body.bio !== undefined)
      author.bio = req.body.bio;

    if (req.body.facebook !== undefined)
      author.facebook = req.body.facebook;

    if (req.body.instagram !== undefined)
      author.instagram = req.body.instagram;

    if (req.body.twitter !== undefined)
      author.twitter = req.body.twitter;

    if (req.body.linkedin !== undefined)
      author.linkedin = req.body.linkedin;

    if (req.body.isActive !== undefined) {
      author.isActive =
        req.body.isActive === true ||
        req.body.isActive === "true";
    }

    if (req.file) {
      author.profileImage = req.file.path;
    }

    await author.save();

    return res.status(200).json({
      success: true,
      message: "Author updated successfully.",
      author,
    });
  } catch (error) {
    console.error("Update Author Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------
   Delete Author
------------------------------------------ */

export const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await BlogAuthor.findById(id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found.",
      });
    }

    await BlogAuthor.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Author deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Author Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------
   Toggle Author Status
------------------------------------------ */

export const toggleAuthorStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await BlogAuthor.findById(id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found.",
      });
    }

    author.isActive = !author.isActive;

    await author.save();

    return res.status(200).json({
      success: true,
      message: `Author ${
        author.isActive ? "activated" : "deactivated"
      }.`,
      isActive: author.isActive,
    });
  } catch (error) {
    console.error("Toggle Author Status Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};