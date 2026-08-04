import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    tripType: {
      type: String,
      required: true,
    },

    destinations: [
      {
        type: String,
      },
    ],

    planningStage: {
      type: String,
      required: true,
    },

    adults: {
      type: Number,
      required: true,
      min: 1,
    },

    children: {
      type: Number,
      default: 0,
    },

    budget: {
      type: String,
      required: true,
    },

    travelDate: {
      type: Date,
      required: true,
    },

    interests: {
      type: String,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    country: {
      name: String,
      code: String,
      dial: String,
    },

    acceptPolicy: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Inquiry", inquirySchema);