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

    // await transporter.sendMail({
    //   from: `"Website Contact" <${process.env.MAIL_USER}>`,
    //   to: process.env.MAIL_RECEIVER,
    //   subject: `New Contact Form - ${inquiry}`,
    //   html: `
    //     <h2>New Contact Submission</h2>
    //     <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Phone:</strong> ${phone}</p>
    //     <p><strong>Inquiry Type:</strong> ${inquiry}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `,
    // });

    await transporter.sendMail({
      from: `"Where To Africa" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_RECEIVER,
      subject: `New Contact Enquiry - ${inquiry}`,
      html: `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Contact Enquiry</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background: #f5f5f5;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="background: #f5f5f5; padding: 25px 15px"
    >
      <tr>
        <td align="center">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              max-width: 700px;
              background: #ffffff;
              border-collapse: collapse;
            "
          >
            <!-- Header -->
           <tr>
  <td style="padding:35px 40px 25px 40px;" align="center">

    <h1
      style="
        margin:0;
        color:#C89D43;
        font-size:40px;
        font-weight:bold;
        font-family:Georgia,'Times New Roman',serif;
      "
    >
      Where To Africa
    </h1>

  </td>
</tr>

<tr>
  <td
    style="
      height:4px;
      background:#C89D43;
    "
  ></td>
</tr>
            <!-- Body -->

            <tr>
              <td style="padding: 45px 40px">
                <h1
                  style="
                    margin: 0;
                    color: #222;
                    font-size: 34px;
                    font-weight: bold;
                  "
                >
                  New Contact Enquiry
                </h1>

                <p
                  style="
                    margin: 25px 0 35px;
                    color: #555;
                    font-size: 17px;
                    line-height: 28px;
                  "
                >
                  A new enquiry has been submitted from your website.
                </p>

                <h2 style="margin: 0 0 25px; color: #222; font-size: 28px">
                  Contact Details
                </h2>

                <table
                  width="100%"
                  cellpadding="10"
                  cellspacing="0"
                  style="font-size: 16px"
                >
                  <tr>
                    <td width="180" style="font-weight: bold; color: #222">
                      First Name
                    </td>
                    <td style="color: #555">${firstName}</td>
                  </tr>

                  <tr>
                    <td style="font-weight: bold; color: #222">Last Name</td>
                    <td style="color: #555">${lastName}</td>
                  </tr>

                  <tr>
                    <td style="font-weight: bold; color: #222">Email</td>
                    <td>
                      <a
                        href="mailto:${email}"
                        style="color: #0d6efd; text-decoration: none"
                      >
                        ${email}
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="font-weight: bold; color: #222">Phone</td>
                    <td style="color: #555">${phone}</td>
                  </tr>

                  <tr>
                    <td style="font-weight: bold; color: #222">Inquiry Type</td>
                    <td style="color: #555">${inquiry}</td>
                  </tr>
                </table>

                <h2 style="margin: 45px 0 20px; color: #222; font-size: 28px">
                  Message
                </h2>

                <div
                  style="
                    background: #fafafa;
                    border-left: 5px solid #c89d43;
                    padding: 22px;
                    color: #444;
                    font-size: 16px;
                    line-height: 30px;
                    word-break: break-word;
                  "
                >
                  ${message}
                </div>

                <p style="margin-top: 35px; color: #777; font-size: 15px">
                  Submitted:
                  <strong>${new Date().toLocaleString()}</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->

            <tr>
              <td
                align="center"
                style="
                  background: #c89d43;
                  padding: 22px;
                  color: #ffffff;
                  font-size: 18px;
                "
              >
                © ${new Date().getFullYear()} Where To Africa
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

`,
    });

    /* ================= THANK YOU EMAIL TO USER ================= */

    // await transporter.sendMail({
    //   from: `"Your Company Name" <${process.env.MAIL_USER}>`,
    //   to: email,
    //   subject: "Thank you for contacting us",
    //   html: `
    //     <p>Dear ${firstName},</p>

    //     <p>Thank you for contacting us. We have received your message and our team will respond shortly.</p>

    //     <p><strong>Your Inquiry:</strong> ${inquiry}</p>

    //     <br/>
    //     <p>Warm regards,</p>
    //     <p><strong>Your Company Team</strong></p>
    //   `,
    // });

    await transporter.sendMail({
      from: `"Where To Africa" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting Where To Africa",
      html: `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Thank You</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:25px 15px;">
<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0" border="0"
style="max-width:700px;background:#ffffff;border-collapse:collapse;">

<!-- Header -->
<tr>
  <td style="padding:35px 40px 25px 40px;" align="center">

    <h1
      style="
        margin:0;
        color:#C89D43;
        font-size:40px;
        font-weight:bold;
        font-family:Georgia,'Times New Roman',serif;
      "
    >
      Where To Africa
    </h1>

  </td>
</tr>

<tr>
  <td
    style="
      height:4px;
      background:#C89D43;
    "
  ></td>
</tr>

<!-- Body -->
<tr>
<td style="padding:45px 40px;">

<h1 style="margin:0;color:#222;font-size:34px;font-weight:bold;">
Thank You!
</h1>

<p style="margin:30px 0 15px;font-size:18px;color:#555;">
Dear <strong>${firstName},</strong>
</p>

<p style="font-size:17px;line-height:30px;color:#555;margin:0;">

Thank you for contacting <strong>Where To Africa</strong>.

<br><br>

We have successfully received your enquiry and appreciate you taking the time to reach out to us.

<br><br>

One of our travel specialists will review your request carefully and get back to you as soon as possible.

</p>

<h2 style="margin:45px 0 25px;color:#222;font-size:28px;">
Your Enquiry Details
</h2>

<table width="100%" cellpadding="10" cellspacing="0" style="font-size:16px;">

<tr>
<td width="180" style="font-weight:bold;color:#222;">Name</td>
<td style="color:#555;">${firstName} ${lastName}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Email</td>
<td>
<a href="mailto:${email}" style="color:#0d6efd;text-decoration:none;">
${email}
</a>
</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Phone</td>
<td style="color:#555;">${phone}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Inquiry Type</td>
<td style="color:#555;">${inquiry}</td>
</tr>

</table>

<h2 style="margin:45px 0 20px;color:#222;font-size:28px;">
Your Message
</h2>

<div
style="
background:#fafafa;
border-left:5px solid #C89D43;
padding:22px;
color:#444;
font-size:16px;
line-height:30px;
word-break:break-word;
">

${message}

</div>

<p style="margin-top:40px;font-size:17px;line-height:30px;color:#555;">

If your enquiry is urgent, you can simply reply to this email or contact our team directly.

We look forward to helping you plan your next unforgettable African adventure.

</p>

<p style="margin-top:45px;font-size:17px;color:#555;">

Warm Regards,

<br><br>

<strong style="font-size:20px;color:#222;">
Where To Africa Team
</strong>

</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td align="center"
style="
background:#C89D43;
padding:22px;
color:#ffffff;
font-size:18px;
">

© ${new Date().getFullYear()} Where To Africa

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
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
