import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema(
  {
    blockId: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "editor",
        "textImage",
        "gallery",
        "imageGrid",
        "slider",
        "image",
        "quote",
        "callout",
        "video",
        "faq",
        "table",
        "divider",
        "button",
        "accordion",
      ],
    },

    layout: {
      type: String,
      enum: ["left", "right"],
      default: "right",
    },

    order: {
      type: Number,
      default: 0,
    },

    title: String,

    subtitle: String,

    content: String,

    text: [String],

    descriptionLeft: String,

    descriptionRight: String,

    caption: String,

    items: [
      {
        question: String,
        answer: String,
        title: String,
        content: String,
        description: String,
      },
    ],

    headers: [String],

    rows: [[String]],

    media: [
      {
        url: {
          type: String,
          required: true,
        },

        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },

        alt: {
          type: String,
          default: "",
        },

        caption: {
          type: String,
          default: "",
        },

        publicId: {
          type: String,
          default: "",
        },
      },
    ],

    buttonText: String,

    buttonUrl: String,

    style: String,

    columns: {
      type: Number,
      default: 3,
    },
  },
  {
    _id: false,
  }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
    },

    bannerImage: {
      type: String,
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogAuthor",
      required: true,
    },

    content: [contentBlockSchema],
    seo: {
      metaTitle: {
        type: String,
        default: "",
      },

      metaDescription: {
        type: String,
        default: "",
      },

      keywords: {
        type: [String],
        default: [],
      },

      canonicalUrl: {
        type: String,
        default: "",
      },

      ogImage: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },

    publishedAt: Date,

    views: {
      type: Number,
      default: 0,
    },

    readingTime: {
      type: Number,
      default: 1,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  
  {
    timestamps: true,
  }
);

export default mongoose.model("SafariBlog", blogSchema);
