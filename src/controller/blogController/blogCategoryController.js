import BlogCategory from "../../models/Blog/BlogCategory.js";

/* ------------------------------------------
   Generate Slug
------------------------------------------ */

const generateSlug = (name) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/* ------------------------------------------
   Create Category
------------------------------------------ */

export const createCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const slug = generateSlug(name);

    const exists = await BlogCategory.findOne({
      $or: [{ name }, { slug }],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists.",
      });
    }

    const category = await BlogCategory.create({
      name,
      slug,
      description: description || "",
      image: req.file?.path || "",
      isActive:
        isActive === undefined
          ? true
          : isActive === true || isActive === "true",
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------
   Get Categories
------------------------------------------ */

export const getCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------
   Get Category By ID
------------------------------------------ */

export const getCategoryById = async (req, res) => {
  try {
    const category = await BlogCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get Category Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------
   Update Category
------------------------------------------ */

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await BlogCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    if (req.body.name && req.body.name !== category.name) {
      const slug = generateSlug(req.body.name);

      const exists = await BlogCategory.findOne({
        slug,
        _id: { $ne: id },
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Category already exists.",
        });
      }

      category.name = req.body.name;
      category.slug = slug;
    }

    if (req.body.description !== undefined) {
      category.description = req.body.description;
    }

    if (req.body.isActive !== undefined) {
      category.isActive =
        req.body.isActive === true || req.body.isActive === "true";
    }

    if (req.file) {
      category.image = req.file.path;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------
   Delete Category
------------------------------------------ */

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await BlogCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    await BlogCategory.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------
   Toggle Category Status
------------------------------------------ */

export const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await BlogCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    category.isActive = !category.isActive;

    await category.save();

    return res.status(200).json({
      success: true,
      message: `Category ${category.isActive ? "activated" : "deactivated"}.`,
      isActive: category.isActive,
    });
  } catch (error) {
    console.error("Toggle Category Status Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
