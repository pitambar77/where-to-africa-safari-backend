import axios from "axios";
import Popupform from "../../models/Popupform/Popupform.js";
import transporter from "../../config/mailer.js";

export const submitPopupform = async (req, res) => {
  try {
    const {
      tripType,
      destinations,
      planningStage,
      adults,
      children,
      travelDate,
      interests,
      firstName,
      lastName,
      email,
      phone,
      country,
      acceptPolicy,
      captchaToken,
    } = req.body;

    if (!captchaToken) {
      return res.status(400).json({
        success: false,
        message: "Please complete the CAPTCHA.",
      });
    }

    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      }
    );

    if (!response.data.success) {
      return res.status(400).json({
        success: false,
        message: "Captcha verification failed.",
      });
    }

    // Validation
    if (
      !tripType ||
      !Array.isArray(destinations) ||
      destinations.length === 0 ||
      !planningStage ||
      !travelDate ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !country ||
      !acceptPolicy
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled.",
      });
    }

    // 3. Email validation  ← ADD HERE
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    // 4. Phone validation (optional but recommended)
    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number.",
      });
    }

    // 5. Save to MongoDB
    const popupform = await Popupform.create({
      tripType,
      destinations,
      planningStage,
      adults,
      children,
      travelDate,
      interests,
      firstName,
      lastName,
      email,
      phone,
      country,
      acceptPolicy,
    });

    await transporter.sendMail({
      from: `"Where To Africa" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_RECEIVER,
      subject: `New Safari Inquiry - ${firstName} ${lastName}`,
      html: `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Safari Inquiry</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:25px 15px;">
<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0" border="0"
style="max-width:700px;background:#ffffff;border-collapse:collapse;">

<!-- Header -->
<tr>
<td style="padding:35px 40px 25px;" align="center">

<h1
style="
margin:0;
color:#C89D43;
font-size:40px;
font-weight:bold;
font-family:Georgia,'Times New Roman',serif;
">
Where To Africa
</h1>

</td>
</tr>

<tr>
<td style="height:4px;background:#C89D43;"></td>
</tr>

<!-- Body -->
<tr>
<td style="padding:45px 40px;">

<h1
style="
margin:0;
color:#222;
font-size:34px;
font-weight:bold;
">
New Safari Inquiry
</h1>

<p
style="
margin:25px 0 35px;
font-size:17px;
line-height:28px;
color:#555;
">
A new safari enquiry has been submitted from the website.
</p>

<h2 style="margin:0 0 25px;color:#222;font-size:28px;">
Customer Details
</h2>

<table width="100%" cellpadding="10" cellspacing="0" style="font-size:16px;">

<tr>
<td width="180" style="font-weight:bold;color:#222;">First Name</td>
<td>${firstName}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Last Name</td>
<td>${lastName}</td>
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
<td>${phone}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Country</td>
<td>${country?.name || ""}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Trip Type</td>
<td>${tripType}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Destinations</td>
<td>${destinations.join(", ")}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Planning Stage</td>
<td>${planningStage}</td>
</tr>


<tr>
<td style="font-weight:bold;color:#222;">Travel Date</td>
<td>${travelDate}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Adults</td>
<td>${adults}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Children</td>
<td>${children}</td>
</tr>

</table>

${
  interests
    ? `
<h2 style="margin:45px 0 20px;color:#222;font-size:28px;">
Special Interests
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
${interests}
</div>
`
    : ""
}

<p style="margin-top:35px;color:#777;font-size:15px;">
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

    /* ================= THANK YOU EMAIL TO CUSTOMER ================= */

    await transporter.sendMail({
      from: `"Where To Africa" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Thank you for your Safari Inquiry",
      html: `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Safari Inquiry Received</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:25px 15px;">
<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0" border="0"
style="max-width:700px;background:#ffffff;border-collapse:collapse;">

<tr>
<td style="padding:35px 40px 25px;" align="center">

<h1
style="
margin:0;
color:#C89D43;
font-size:40px;
font-weight:bold;
font-family:Georgia,'Times New Roman',serif;
">
Where To Africa
</h1>

</td>
</tr>

<tr>
<td style="height:4px;background:#C89D43;"></td>
</tr>

<tr>
<td style="padding:45px 40px;">

<h1
style="
margin:0;
color:#222;
font-size:34px;
font-weight:bold;
">
Thank You!
</h1>

<p style="margin:30px 0 15px;font-size:18px;color:#555;">
Dear <strong>${firstName} ${lastName},</strong>
</p>

<p style="font-size:17px;line-height:30px;color:#555;">

Thank you for submitting your safari enquiry with
<strong>Where To Africa.</strong>

<br><br>

We have successfully received your request.

Our safari specialists are now reviewing your travel preferences and will get back to you with a personalised itinerary and quotation as soon as possible.

</p>

<h2
style="
margin:45px 0 25px;
color:#222;
font-size:28px;
">
Your Safari Inquiry
</h2>

<table width="100%" cellpadding="10" cellspacing="0" style="font-size:16px;">

<tr>
<td width="180" style="font-weight:bold;color:#222;">Name</td>
<td>${firstName} ${lastName}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Email</td>
<td>${email}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Phone</td>
<td>${phone}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Trip Type</td>
<td>${tripType}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Destinations</td>
<td>${destinations.join(", ")}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Planning Stage</td>
<td>${planningStage}</td>
</tr>


<tr>
<td style="font-weight:bold;color:#222;">Travel Date</td>
<td>${travelDate}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Adults</td>
<td>${adults}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Children</td>
<td>${children}</td>
</tr>

<tr>
<td style="font-weight:bold;color:#222;">Country</td>
<td>${country.name}</td>
</tr>

</table>

${
  interests
    ? `
<h2 style="margin:45px 0 20px;color:#222;font-size:28px;">
Special Interests
</h2>

<div
style="
background:#fafafa;
border-left:5px solid #C89D43;
padding:22px;
color:#444;
font-size:16px;
line-height:30px;
">
${interests}
</div>
`
    : ""
}

<p
style="
margin-top:40px;
font-size:17px;
line-height:30px;
color:#555;
">

If you have any additional information or questions, simply reply to this email.

We look forward to helping you plan an unforgettable African safari.

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

<tr>
<td
align="center"
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

    return res.status(201).json({
      success: true,
      message: "Your inquiry has been submitted successfully.",
      data: popupform,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
