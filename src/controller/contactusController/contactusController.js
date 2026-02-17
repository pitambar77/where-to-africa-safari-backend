import Contact from "../../models/Contact/ContactForm.js";
import transporter from "../../config/mailer.js";

export const submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, inquiry, message } = req.body;

    /* ================= VALIDATION ================= */

    if (!firstName || !lastName || !email || !phone || !inquiry || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Phone validation (numbers + optional +, 7–15 digits)
    const phoneRegex = /^[0-9+]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    /* ================= SAVE TO DB ================= */

    const newContact = await Contact.create({
      firstName,
      lastName,
      email,
      phone,
      inquiry,
      message,
    });

    /* ================= EMAIL TO ADMIN ================= */

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form - ${inquiry}`,
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Inquiry Type:</strong> ${inquiry}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    /* ================= THANK YOU EMAIL TO USER ================= */

    await transporter.sendMail({
      from: `"Your Company Name" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting us",
      html: `
        <p>Dear ${firstName},</p>

        <p>Thank you for contacting us. We have received your message and our team will respond shortly.</p>

        <p><strong>Your Inquiry:</strong> ${inquiry}</p>

        <br/>
        <p>Warm regards,</p>
        <p><strong>Your Company Team</strong></p>
      `,
    });

    /* ================= RESPONSE ================= */

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newContact,
    });

  } catch (error) {
    console.error("Contact form error:", error);

    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
