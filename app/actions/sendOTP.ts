"use server";

import { db } from "@/lib/prisma";
import nodemailer from "nodemailer";

export const sendOTP = async (email: string, firstName: string) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await db.user.update({
      where: { email },
      data: {
        otp,
        otpExpiry,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Venture" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "Verify Your Account",
      text: `Dear ${firstName},\n\nTo complete the email verification process, please use the following One-Time Password (OTP):\nYour OTP code: ${otp}\nThis code will expire in 5 minutes.\n\nIf you did not initiate this request, please disregard this email.\n\nBest regards,\nVenture`,
    };

    await transporter.sendMail(mailOptions);

    return { message: "OTP has been sent to your email.", status: 200 };
  } catch (error) {
    console.error("Error during OTP generation or email sending:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
      status: 500,
    };
  }
};
