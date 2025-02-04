import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// Create the transporter using your previous working configuration
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER ,
    pass: process.env.EMAIL_PASS, // Ensure this is set in your .env file
  },
});

// Wrap sendMail in a promise to use with async/await
const sendEmail = async (email, subject, htmlMessage) => {
  const mailOptions = {
    from: process.env.EMAIL_USER ,
    to: email,
    subject:subject,
    html: htmlMessage, // Using HTML for richer formatting
  };
 

  try {
    console.log(process.env.EMAIL_PASS);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info);
    return info;
  } catch (error) {
    console.error("Error in sendEmail:", error);
    throw new Error("Email could not be sent");
  }
};

const getDetails = asyncHandler(async (req, res) => {
  const { companyName, yourName, email, phoneNumber } = req.body;

  if (!companyName || !yourName || !email || !phoneNumber) {
    throw new ApiError(400, "Please fill all the fields");
  }

  // Construct the email subject and body
  const subject = "Sponsorship Request Received";
  const htmlMessage = `
    <div>
      <p>Dear ${yourName},</p>
      <p>Thank you for showing interest in sponsoring us.</p>
      <p><strong>Company Name:</strong> ${companyName}</p>
      <p><strong>Your Name:</strong> ${yourName}</p>
      <p><strong>Phone:</strong> ${phoneNumber}</p>
      <p>We will reach out to you shortly.</p>
      <p>Best Regards,</p>
      <p>Your Team</p>
    </div>
  `;

  try {
    await sendEmail(email, subject, htmlMessage);
  } catch (error) {
    // Forward the error with your custom ApiError
    throw new ApiError(500, error.message || "Email could not be sent");
  }

  res.status(200).json({
    success: true,
    message: "Sponsorship request received. An email has been sent.",
  });
});

export { getDetails };
