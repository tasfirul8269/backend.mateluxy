import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/erros.js";
import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Create a schema for password reset tokens if it doesn't exist
import mongoose from "mongoose";

// Check if the schema already exists to avoid model overwrite errors
const PasswordResetToken = mongoose.models.PasswordResetToken || 
  mongoose.model('PasswordResetToken', new mongoose.Schema({
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Admin'
    },
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600 // Token expires after 1 hour
    }
  }));

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Request a password reset
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      // Return an error message indicating no admin was found with this email
      return res.status(404).json({ 
        success: false,
        message: "No admin account found with this email address."
      });
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save the token to the database
    await PasswordResetToken.findOneAndDelete({ adminId: admin._id });
    await new PasswordResetToken({
      adminId: admin._id,
      token: hashedToken
    }).save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@mateluxy.com',
      to: admin.email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>Hello ${admin.fullName || admin.username},</p>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #e53e3e; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link is valid for 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Thank you,</p>
        <p>The MateLuxy Team</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "If your email exists in our system, you will receive a password reset link."
    });

  } catch (error) {
    next(error);
  }
};

// Reset password with token
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token from the URL
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find the token in the database
    const resetToken = await PasswordResetToken.findOne({ token: hashedToken });
    if (!resetToken) {
      return next(errorHandler(400, "Invalid or expired token"));
    }

    // Find the admin
    const admin = await Admin.findById(resetToken.adminId);
    if (!admin) {
      return next(errorHandler(400, "Admin not found"));
    }

    // Validate the new password
    if (!password || password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }

    // Hash the new password
    const hashedPassword = bcryptjs.hashSync(password, 10);
    
    // Update the admin's password
    admin.password = hashedPassword;
    await admin.save();

    // Delete the reset token
    await PasswordResetToken.findByIdAndDelete(resetToken._id);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully"
    });

  } catch (error) {
    next(error);
  }
};
