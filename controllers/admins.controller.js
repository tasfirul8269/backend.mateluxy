import Admin from "../models/admin.model.js";
import { errorHandler } from "../utils/erros.js";
import bcryptjs from "bcryptjs";

export const admins = async (req, res, next) => {
    try {
        const allAdmins = await Admin.find().select('-password');  // Exclude password field
        res.status(200).json(allAdmins);
    } catch (error) {
        next(error);
    }
};

export const updateAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, fullName, email, password, profileImage } = req.body;

        // Create update object
        const updateData = {
            username,
            fullName,
            email,
            profileImage
        };

        // Only hash and update password if it's provided
        if (password) {
            updateData.password = await bcryptjs.hash(password, 10);
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json(updatedAdmin);
    } catch (error) {
        next(error);
    }
};

export const deleteAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Check if this is the last admin
        const adminCount = await Admin.countDocuments();
        if (adminCount <= 1) {
            return res.status(400).json({ 
                message: "Cannot delete the last admin. At least one admin must remain in the system." 
            });
        }

        const deletedAdmin = await Admin.findByIdAndDelete(id);

        if (!deletedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const checkUsernameAvailability = async (req, res) => {
    try {
        const { username, currentId } = req.query;
        
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Build query to check username availability
        const query = { username: username.toLowerCase() };
        
        // If currentId is provided, exclude the current admin from the check
        if (currentId) {
            query._id = { $ne: currentId };
        }

        const existingAdmin = await Admin.findOne(query);
        
        res.json({ available: !existingAdmin });
    } catch (error) {
        console.error("Error checking username availability:", error);
        res.status(500).json({ message: "Error checking username availability" });
    }
};