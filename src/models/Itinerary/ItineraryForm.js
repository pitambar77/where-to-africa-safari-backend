import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    // Trip information
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: false,
    },

    tripTitle: {
      type: String,
      required: true,
      trim: true,
    },

    tripSubtitle: {
      type: String,
      trim: true,
    },

    travelDate: {
      type: Date,
      required: true,
    },

    // Personal details
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

    countryCode: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    // Additional information
    additionalInfo: {
      type: String,
      trim: true,
      default: "",
    },

    // Contact preferences
    contactByEmail: {
      type: Boolean,
      default: false,
    },

    contactByPhone: {
      type: Boolean,
      default: false,
    },

    // Marketing preferences
    newsUpdates: {
      type: Boolean,
      default: false,
    },

    pastTraveller: {
      type: Boolean,
      default: false,
    },

    // Privacy policy
    acceptPolicy: {
      type: Boolean,
      required: true,
    },

    status: {
      type: String,
      enum: ["new", "contacted", "confirmed", "cancelled"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Itineraryform", itinerarySchema);