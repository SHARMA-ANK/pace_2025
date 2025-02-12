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
  
  res.status(200).json({
    success: true,
    message: "Sponsorship request received. An email has been sent.",
  });
});

export { getDetails };
