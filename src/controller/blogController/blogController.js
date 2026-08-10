import SafariBlog from "../../models/Blog/SafariBlog.js";
import BlogCategory from "../../models/Blog/BlogCategory.js";
import BlogAuthor from "../../models/Blog/BlogAuthor.js";

/* ------------------------------------------
   Generate Unique Slug
------------------------------------------ */
const generateUniqueSlug = async (title) => {
  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  let slug = baseSlug;
  let counter = 1;

  while (await SafariBlog.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

/* ------------------------------------------
   Calculate Reading Time
------------------------------------------ */

const calculateReadingTime = (content = []) => {
  let words = 0;

  content.forEach((block) => {
    if (block.content) {
      words += block.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    }

    if (Array.isArray(block.text)) {
      block.text.forEach((item) => {
        words += item.split(/\s+/).length;
      });
    }

    if (block.descriptionLeft) {
      words += block.descriptionLeft.split(/\s+/).length;
    }

    if (block.descriptionRight) {
      words += block.descriptionRight.split(/\s+/).length;
    }

    if (Array.isArray(block.items)) {
      block.items.forEach((item) => {
        if (item.question) {
          words += item.question.split(/\s+/).length;
        }

        if (item.answer) {
          words += item.answer.split(/\s+/).length;
        }

        if (item.title) {
          words += item.title.split(/\s+/).length;
        }

        if (item.description) {
          words += item.description.split(/\s+/).length;
        }
      });
    }
  });

  return Math.max(1, Math.ceil(words / 200));
};

/* ------------------------------------------
   Create Blog
------------------------------------------ */

export const createBlog = async (req, res) => {
  try {
    let {
      title,
      excerpt,
      category,
      author,
      featured,
      status,
      publishedAt,
      seo,
      content,
    } = req.body;

    /* ----------------------------------
       Validation
    ---------------------------------- */

    if (!title || !excerpt || !category || !author) {
      return res.status(400).json({
        success: false,
        message: "Title, excerpt, category and author are required.",
      });
    }

    /* ----------------------------------
       Category
    ---------------------------------- */

    const categoryExists = await BlogCategory.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    /* ----------------------------------
       Author
    ---------------------------------- */

    const authorExists = await BlogAuthor.findById(author);

    if (!authorExists) {
      return res.status(404).json({
        success: false,
        message: "Author not found.",
      });
    }

    /* ----------------------------------
       Banner Image
    ---------------------------------- */

    if (!req.files?.bannerImage?.length) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required.",
      });
    }

    const bannerImage = req.files.bannerImage[0].path;

    /* ----------------------------------
       Parse JSON
    ---------------------------------- */

    try {
      content =
        typeof content === "string" ? JSON.parse(content) : content || [];
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid content JSON.",
      });
    }

    try {
      seo = typeof seo === "string" ? JSON.parse(seo) : seo || {};
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid SEO JSON.",
      });
    }

    /* ----------------------------------
       Block Order
    ---------------------------------- */

    content = content.map((block, index) => ({
      ...block,
      order: index + 1,
    }));

    /* ----------------------------------
       Slug
    ---------------------------------- */

    const slug = await generateUniqueSlug(title);

    /* ----------------------------------
       Reading Time
    ---------------------------------- */

    const readingTime = calculateReadingTime(content);

    /* ----------------------------------
       Create Blog
    ---------------------------------- */

    const blog = await SafariBlog.create({
      title,
      slug,
      excerpt,

      bannerImage,

      featured: featured === true || featured === "true",

      status: status || "Draft",

      publishedAt: status === "Published" ? publishedAt || new Date() : null,

      category,

      author,

      seo,

      content,

      readingTime,
    });

    const populatedBlog = await SafariBlog.findById(blog._id)
      .populate("category", "name slug")
      .populate("author", "name image");

    return res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      blog: populatedBlog,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
///

/* ------------------------------------------
   Upload Media
------------------------------------------ */

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const media = {
      url: req.file.path,

      publicId: req.file.filename,

      type: req.file.mimetype.startsWith("video/") ? "video" : "image",

      alt: "",

      caption: "",
    };

    return res.status(200).json({
      success: true,

      message: "Media uploaded successfully.",

      media,
    });
  } catch (error) {
    console.error("Upload Media Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/////

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      title,
      slug,
      excerpt,
      category,
      author,
      featured,
      status,
      publishedAt,
      seo,
      content,
    } = req.body;

    /* ----------------------------------
       Find Blog
    ---------------------------------- */

    const blog = await SafariBlog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    /* ----------------------------------
       Validate Category
    ---------------------------------- */

    if (category) {
      const categoryExists = await BlogCategory.findById(category);

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }
    }

    /* ----------------------------------
       Validate Author
    ---------------------------------- */

    if (author) {
      const authorExists = await BlogAuthor.findById(author);

      if (!authorExists) {
        return res.status(404).json({
          success: false,
          message: "Author not found.",
        });
      }
    }

    /* ----------------------------------
       Banner Image
    ---------------------------------- */

    let bannerImage = blog.bannerImage;

    if (req.files?.bannerImage?.length) {
      bannerImage = req.files.bannerImage[0].path;
    }

    /* ----------------------------------
       Parse JSON
    ---------------------------------- */

    try {
      if (content) {
        content = typeof content === "string" ? JSON.parse(content) : content;

        content = content.map((block, index) => ({
          ...block,
          order: index + 1,
        }));
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid Content JSON.",
      });
    }

    try {
      seo = typeof seo === "string" ? JSON.parse(seo) : seo || {};
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid SEO JSON.",
      });
    }

    /* ----------------------------------
       Regenerate Slug (if title changed)
    ---------------------------------- */

    // let slug = blog.slug;

    // if (title && title !== blog.title) {
    //   slug = await generateUniqueSlug(title);
    // }

    /* ----------------------------------
   Slug
---------------------------------- */

    let finalSlug = blog.slug;

    // User manually changed the slug
    if (slug && slug.trim() !== blog.slug) {
      finalSlug = slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      // Check if another blog already has this slug
      const existingBlog = await SafariBlog.findOne({
        slug: finalSlug,
        _id: { $ne: blog._id },
      });

      if (existingBlog) {
        return res.status(400).json({
          success: false,
          message: "This slug is already used by another blog.",
        });
      }
    }

    // Title changed and slug was NOT manually changed
    else if (title && title !== blog.title) {
      finalSlug = await generateUniqueSlug(title);
    }

    /* ----------------------------------
       Reading Time
    ---------------------------------- */

    const readingTime = content
      ? calculateReadingTime(content)
      : blog.readingTime;

    /* ----------------------------------
       Update
    ---------------------------------- */

    blog.title = title ?? blog.title;
    blog.slug = finalSlug;
    blog.excerpt = excerpt ?? blog.excerpt;

    blog.bannerImage = bannerImage;

    blog.category = category ?? blog.category;
    blog.author = author ?? blog.author;

    blog.featured =
      featured !== undefined
        ? featured === true || featured === "true"
        : blog.featured;

    blog.status = status ?? blog.status;

    if (blog.status === "Published") {
      blog.publishedAt = publishedAt || blog.publishedAt || new Date();
    } else {
      blog.publishedAt = null;
    }

    blog.seo = seo ?? blog.seo;

    blog.content = content ?? blog.content;

    blog.readingTime = readingTime;

    await blog.save();

    const updatedBlog = await SafariBlog.findById(blog._id)
      .populate("category", "name slug")
      .populate("author", "name image");

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Update Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/* ------------------------------------------
   Get All Blogs
------------------------------------------ */

export const getBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      search = "",
      category,
      author,
      featured,
      status,
    } = req.query;

    const query = {
      isDeleted: false,
    };

    /* -----------------------------
       Search
    ----------------------------- */

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          excerpt: {
            $regex: search,
            $options: "i",
          },
        },
        {
          "seo.metaTitle": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    /* -----------------------------
       Filters
    ----------------------------- */

    if (category) {
      query.category = category;
    }

    if (author) {
      query.author = author;
    }

    if (status) {
      query.status = status;
    }

    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    /* -----------------------------
       Pagination
    ----------------------------- */

    const currentPage = Number(page);
    const pageLimit = Number(limit);

    const skip = (currentPage - 1) * pageLimit;

    const total = await SafariBlog.countDocuments(query);

    const blogs = await SafariBlog.find(query)
      .select(
        "title slug excerpt bannerImage featured status readingTime views publishedAt category author"
      )
      .populate("category", "name slug")
      .populate("author", "name image")
      .sort({
        publishedAt: -1,
      })
      .skip(skip)
      .limit(pageLimit);

    return res.status(200).json({
      success: true,

      blogs,

      total,

      page: currentPage,

      totalPages: Math.ceil(total / pageLimit),

      hasMore: skip + blogs.length < total,
    });
  } catch (error) {
    console.error("Get Blogs Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------
   Get Blog By Id
------------------------------------------ */

export const getBlogById = async (req, res) => {
  try {
    const blog = await SafariBlog.findById(req.params.id)
      .populate("category")
      .populate("author");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------
   Get Blog By Slug
------------------------------------------ */

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await SafariBlog.findOne({
      slug,
      isDeleted: false,
      status: "Published",
    })
      .populate("category", "name slug")
      .populate("author", "name image");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    /* -----------------------------
       Increase Views
    ----------------------------- */

    await SafariBlog.findByIdAndUpdate(blog._id, {
      $inc: {
        views: 1,
      },
    });
    /* -----------------------------
       Related Blogs
    ----------------------------- */

    const relatedBlogs = await SafariBlog.find({
      _id: { $ne: blog._id },

      category: blog.category._id,

      status: "Published",

      isDeleted: false,
    })
      .select("title slug bannerImage excerpt category author publishedAt")
      .populate("category", "name slug")
      .populate("author", "name image")
      .limit(6);

    return res.status(200).json({
      success: true,

      blog,

      relatedBlogs,
    });
  } catch (error) {
    console.error("Get Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------
   Delete Blog (Soft Delete)
------------------------------------------ */

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await SafariBlog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    if (blog.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Blog already deleted.",
      });
    }

    blog.isDeleted = true;

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/* ------------------------------------------
   Get Featured Blogs
------------------------------------------ */

export const getFeaturedBlogs = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 5, 20);

    const blogs = await SafariBlog.find({
      featured: true,
      status: "Published",
      isDeleted: false,
    })
      .populate("category", "name slug")
      .populate("author", "name image")
      .sort({ publishedAt: -1 })
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error("Get Featured Blogs Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/* ------------------------------------------
   Toggle Featured Blog
------------------------------------------ */

export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await SafariBlog.findById(id);

    if (!blog || blog.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    // Toggle featured status
    blog.featured = !blog.featured;

    await blog.save();

    return res.status(200).json({
      success: true,
      message: `Blog ${
        blog.featured ? "marked as featured" : "removed from featured"
      }.`,
      featured: blog.featured,
    });
  } catch (error) {
    console.error("Toggle Featured Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/* ------------------------------------------
   Update Blog Status
------------------------------------------ */

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Draft", "Published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Draft or Published.",
      });
    }

    const blog = await SafariBlog.findById(id);

    if (!blog || blog.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    blog.status = status;

    // Set publish date when first published
    if (status === "Published" && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    if (status === "Draft") {
      blog.publishedAt = null;
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      message: `Blog status updated to ${status}.`,
      status: blog.status,
    });
  } catch (error) {
    console.error("Update Status Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/* ------------------------------------------
   Get Related Blogs
------------------------------------------ */

export const getRelatedBlogs = async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 6 } = req.query;

    const currentBlog = await SafariBlog.findOne({
      slug,
      isDeleted: false,
      status: "Published",
    });

    if (!currentBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    const relatedBlogs = await SafariBlog.find({
      _id: { $ne: currentBlog._id },
      category: currentBlog.category,
      status: "Published",
      isDeleted: false,
    })
      .populate("category", "name slug")
      .populate("author", "name image")
      .sort({ publishedAt: -1 })
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      count: relatedBlogs.length,
      blogs: relatedBlogs,
    });
  } catch (error) {
    console.error("Related Blogs Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
