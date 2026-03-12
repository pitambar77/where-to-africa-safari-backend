import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
// import { sendOTP } from "../config/mail.js";
import { sendOtpMail } from "../utils/sendOtpMail.js";

// 1️⃣ Send OTP
// export const sendLoginOTP = async (req, res) => {
//   const { email } = req.body;

//   const otp = otpGenerator.generate(6, {
//     upperCaseAlphabets: false,
//     specialChars: false,
//   });

//   const expireTime = new Date(Date.now() + 5 * 60 * 1000);

//   let admin = await Admin.findOne({ email });

//   if (!admin) {
//     admin = await Admin.create({ email });
//   }

//   admin.otp = otp;
//   admin.otpExpire = expireTime;
//   await admin.save();

//   await sendOtpMail(email, otp);

//   res.json({ message: "OTP sent successfully" });
// };

import bcrypt from "bcryptjs";

export const sendLoginOTP = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // 🔐 Generate OTP
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  admin.otp = otp;
  admin.otpExpire = new Date(Date.now() + 5 * 60 * 1000);

  await admin.save();

  await sendOtpMail(admin.email, otp);

  res.json({ message: "OTP sent successfully" });
};

// 2️⃣ Verify OTP
// export const verifyOTP = async (req, res) => {
//   const { email, otp } = req.body;

//   const admin = await Admin.findOne({ email });

//   if (!admin || admin.otp !== otp) {
//     return res.status(400).json({ message: "Invalid OTP" });
//   }

//   if (admin.otpExpire < new Date()) {
//     return res.status(400).json({ message: "OTP expired" });
//   }

//   const token = jwt.sign(
//     { id: admin._id, role: admin.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );

//   admin.otp = null;
//   admin.otpExpire = null;
//   await admin.save();

//   res.json({
//     token,
//     role: admin.role,
//     message: "Login successful",
//   });
// };

export const verifyOTP = async (req, res) => {
  const { username, otp } = req.body;

  const admin = await Admin.findOne({ username });

  if (!admin || admin.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (admin.otpExpire < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  admin.otp = null;
  admin.otpExpire = null;
  await admin.save();

  res.json({
    token,
    role: admin.role,
    message: "Login successful",
  });
};