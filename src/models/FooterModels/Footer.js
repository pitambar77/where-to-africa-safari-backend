import mongoose from "mongoose";

const quickLinkSchema = new mongoose.Schema({
  title: String,
  url: String,
});

const officeSchema = new mongoose.Schema({
  title: String,
  phone: String,
  mobile: String,
  email: String,
  address: String,
});

const footerSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
    },

    quickLinks: [quickLinkSchema],

    southAfricaOffice: officeSchema,

    zimbabweOffice: officeSchema,

    reviewWidget: {
      type: String,
    },

    copyright: {
      type: String,
    },

    designerName: {
      type: String,
    },

    designerLink: {
      type: String,
    },

    privacyPolicyLink: {
      type: String,
      default: "/privacy-policy",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Footer", footerSchema);
