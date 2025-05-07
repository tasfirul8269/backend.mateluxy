import Admin from "../models/admin.model.js";
import { errorHandler } from "../utils/erros.js";
import bcryptjs from "bcryptjs";

// Get current admin profile
export const getCurrentAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    
    if (!admin) {
      return next(errorHandler(404, "Admin not found"));
    }
    
    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "You can only update your own profile"));
  }

  try {
    const { password, email, username, ...otherDetails } = req.body;
    
    const updateFields = { ...otherDetails };
    
    // Check if email is being updated and if it's already in use
    if (email) {
      const existingAdmin = await Admin.findOne({ email, _id: { $ne: req.user.id } });
      if (existingAdmin) {
        return next(errorHandler(400, "Email already in use"));
      }
      updateFields.email = email;
    }
    
    // Check if username is being updated and if it's already in use
    if (username) {
      const existingAdmin = await Admin.findOne({ username, _id: { $ne: req.user.id } });
      if (existingAdmin) {
        return next(errorHandler(400, "Username already in use"));
      }
      updateFields.username = username;
    }
    
    // If password is being updated, hash it
    if (password) {
      const hashedPassword = bcryptjs.hashSync(password, 10);
      updateFields.password = hashedPassword;
    }
    
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select("-password");
    
    res.status(200).json(updatedAdmin);
  } catch (error) {
    next(error);
  }
};

// Check auth status
export const checkAuthStatus = async (req, res) => {
  res.status(200).json({ success: true });
};

// Logout admin
export const logoutAdmin = async (req, res) => {
  res.clearCookie("access_token").status(200).json({ success: true, message: "Logged out successfully" });
}; 