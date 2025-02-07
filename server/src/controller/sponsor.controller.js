import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {Registration} from "../models/registration.js";
const qrCode="https://res.cloudinary.com/dgqcok3ec/image/upload/v1738952425/ppi3cqphdsbfffpwwumo.jpg"
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

  const registration=await Registration.create({
    name: yourName,
    email,
    phoneNo: phoneNumber,
  });
  

  // Construct the email subject and body
  const subject = " Thank you for showing interest in sponsoring PACE 2025! ";
  const htmlMessage = `
    
  <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 600px; margin: auto;">
    <h2 style="text-align: center; color: #007BFF;"> Thank you for showing interest in sponsoring PACE 2025! </h2>
    <b>Every contribution, big or small, helps us create an unforgettable experience for AITians.</b>
    <p>Your support strengthens the spirit, and keeps the legacy alive. We truly appreciate your generosity in making this event bigger and better! 🏆</p>
    
    <div style="text-align: center; margin: 20px 0;">
        <b> Scan the QR code below to make your contribution and be a part of this incredible journey! </b>
        <br/><br/>
        <img src="${qrCode}" alt="QR Code" style="width: 300px; height: 400px;" />
        <br/>
    </div>
    
    <b>📩 After making the payment, please revert back to us on this email with a screenshot of the transaction page for confirmation.</b>
    
    
    <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
    
    <p style="text-align: center; color: #333;">
        <b>Warm Regards,</b><br/>
        <b>AIT Sports Club</b><br/>
        📞 +91 9347972885 <br/>
        📩 <a href="mailto:pace2k25@gmail.com" style="color: #007BFF; text-decoration: none;">pace2k25@gmail.com</a><br/>
        🌐 <a href="https://www.pace2025.in" style="color: #007BFF; text-decoration: none;">www.pace2025.in</a><br/>
        <br/>
        Let’s make PACE 2025 unforgettable, together. 🎉
    </p>
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
