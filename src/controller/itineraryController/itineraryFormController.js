import Itineraryform from "../../models/Itinerary/ItineraryForm.js";
import transporter from "../../config/mailer.js";

export const submitItineraryForm = async (req, res) => {
  try {
    const {
      tripId,
      tripTitle,
      tripSubtitle,
      travelDate,
      firstName,
      lastName,
      email,
      countryCode,
      phone,
      additionalInfo,
      contactByEmail,
      contactByPhone,
      newsUpdates,
      pastTraveller,
      acceptPolicy,
    } = req.body;

    // ================= VALIDATION =================

    if (
      !tripTitle ||
      !travelDate ||
      !firstName ||
      !lastName ||
      !email ||
      !countryCode ||
      !phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    if (!acceptPolicy) {
      return res.status(400).json({
        success: false,
        message: "Please accept the Privacy Policy.",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Phone validation
    const phoneRegex = /^\d{7,15}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number.",
      });
    }

    // ================= SAVE TO DATABASE =================

    const newItinerary = await Itineraryform.create({
      tripId: tripId || null,
      tripTitle,
      tripSubtitle,
      travelDate,
      firstName,
      lastName,
      email,
      countryCode,
      phone,
      additionalInfo,
      contactByEmail,
      contactByPhone,
      newsUpdates,
      pastTraveller,
      acceptPolicy,
    });

    // ================= ADMIN EMAIL =================

    await transporter.sendMail({
      from: `"Where To Africa" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_RECEIVER,

      subject: `New Package Enquiry - ${tripTitle}`,

      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>New Package Enquiry</title>
        </head>

        <body
          style="
            margin:0;
            padding:25px;
            background:#f5f5f5;
            font-family:Arial,Helvetica,sans-serif;
          "
        >

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width:700px;
              margin:auto;
              background:#ffffff;
            "
          >

            <tr>
              <td
                style="
                  padding:30px;
                  text-align:center;
                  border-bottom:4px solid #C89D43;
                "
              >
                <h1
                  style="
                    margin:0;
                    color:#C89D43;
                    font-family:Georgia,serif;
                  "
                >
                  Where To Africa
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:40px">

                <h2 style="color:#222;">
                  New Package Enquiry
                </h2>

                <p style="color:#555;">
                  A customer has submitted a package / itinerary enquiry.
                </p>

                <h3 style="color:#222;margin-top:30px;">
                  Package Details
                </h3>

                <table
                  width="100%"
                  cellpadding="10"
                  cellspacing="0"
                  style="font-size:16px"
                >

                  <tr>
                    <td style="font-weight:bold;">
                      Package
                    </td>
                    <td>
                      ${tripTitle}
                    </td>
                  </tr>

                  <tr>
                    <td style="font-weight:bold;">
                      Subtitle
                    </td>
                    <td>
                      ${tripSubtitle || "-"}
                    </td>
                  </tr>

                  <tr>
                    <td style="font-weight:bold;">
                      Travel Date
                    </td>
                    <td>
                      ${new Date(travelDate).toLocaleDateString()}
                    </td>
                  </tr>

                </table>

                <h3 style="color:#222;margin-top:35px;">
                  Customer Details
                </h3>

                <table
                  width="100%"
                  cellpadding="10"
                  cellspacing="0"
                  style="font-size:16px"
                >

                  <tr>
                    <td style="font-weight:bold;">
                      Name
                    </td>
                    <td>
                      ${firstName} ${lastName}
                    </td>
                  </tr>

                  <tr>
                    <td style="font-weight:bold;">
                      Email
                    </td>
                    <td>
                      <a href="mailto:${email}">
                        ${email}
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="font-weight:bold;">
                      Phone
                    </td>
                    <td>
                      ${countryCode} ${phone}
                    </td>
                  </tr>

                  <tr>
                    <td style="font-weight:bold;">
                      Contact by Email
                    </td>
                    <td>
                      ${contactByEmail ? "Yes" : "No"}
                    </td>
                  </tr>

                  <tr>
                    <td style="font-weight:bold;">
                      Contact by Phone
                    </td>
                    <td>
                      ${contactByPhone ? "Yes" : "No"}
                    </td>
                  </tr>

                  <tr>
                    <td style="font-weight:bold;">
                      Newsletter
                    </td>
                    <td>
                      ${newsUpdates ? "Yes" : "No"}
                    </td>
                  </tr>

                  <tr>
                    <td style="font-weight:bold;">
                      Past Traveller
                    </td>
                    <td>
                      ${pastTraveller ? "Yes" : "No"}
                    </td>
                  </tr>

                </table>

                <h3 style="color:#222;margin-top:35px;">
                  Additional Information
                </h3>

                <div
                  style="
                    background:#fafafa;
                    border-left:5px solid #C89D43;
                    padding:20px;
                    color:#444;
                    line-height:28px;
                  "
                >
                  ${additionalInfo || "No additional information provided."}
                </div>

                <p
                  style="
                    margin-top:35px;
                    color:#777;
                  "
                >
                  Submitted:
                  <strong>
                    ${new Date().toLocaleString()}
                  </strong>
                </p>

              </td>
            </tr>

            <tr>
              <td
                style="
                  background:#C89D43;
                  padding:20px;
                  text-align:center;
                  color:#ffffff;
                "
              >
                © ${new Date().getFullYear()} Where To Africa
              </td>
            </tr>

          </table>

        </body>
        </html>
      `,
    });

    // ================= THANK YOU EMAIL =================

    await transporter.sendMail({
      from: `"Where To Africa" <${process.env.MAIL_USER}>`,
      to: email,

      subject: "Thank you for your enquiry - Where To Africa",

      html: `
        <!DOCTYPE html>
        <html>
        <body
          style="
            margin:0;
            padding:25px;
            background:#f5f5f5;
            font-family:Arial,Helvetica,sans-serif;
          "
        >

          <div
            style="
              max-width:700px;
              margin:auto;
              background:#ffffff;
              padding:40px;
            "
          >

            <h1
              style="
                color:#C89D43;
                font-family:Georgia,serif;
              "
            >
              Where To Africa
            </h1>

            <h2>
              Thank You, ${firstName}!
            </h2>

            <p style="font-size:17px;line-height:30px;color:#555;">
              Thank you for your interest in
              <strong>${tripTitle}</strong>.
            </p>

            <p style="font-size:17px;line-height:30px;color:#555;">
              We have received your travel enquiry successfully.
              One of our travel specialists will review your request
              and get back to you shortly.
            </p>

            <h3>
              Your Travel Details
            </h3>

            <p>
              <strong>Package:</strong>
              ${tripTitle}
            </p>

            <p>
              <strong>Travel Date:</strong>
              ${new Date(travelDate).toLocaleDateString()}
            </p>

            <p style="margin-top:35px;">
              Warm Regards,<br />
              <strong>Where To Africa Team</strong>
            </p>

          </div>

        </body>
        </html>
      `,
    });

    // ================= RESPONSE =================

    return res.status(201).json({
      success: true,
      message: "Package enquiry submitted successfully.",
      data: newItinerary,
    });

  } catch (error) {
    console.error("Itinerary form error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};