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
        const { username, fullName, email, password, profileImage, role } = req.body;
        
        // Get the requesting admin's info from the token
        const requestingAdminId = req.user.id;
        const requestingAdmin = await Admin.findById(requestingAdminId);
        
        if (!requestingAdmin) {
            return next(errorHandler(404, "Requesting admin not found"));
        }
        
        // Only Super Admin can change roles or update other admins
        if (requestingAdmin.role !== 'Super Admin' && id !== requestingAdminId) {
            return next(errorHandler(403, "Only Super Admins can update other admin accounts"));
        }
        
        // Only Super Admin can set roles
        if (role && role !== requestingAdmin.role && requestingAdmin.role !== 'Super Admin') {
            return next(errorHandler(403, "Only Super Admins can change admin roles"));
        }

        // Create update object
        const updateData = {
            username,
            fullName,
            email,
            profileImage
        };
        
        // Include role in update if provided
        if (role) {
            updateData.role = role;
        }

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
        
        // Get the requesting admin's info from the token
        const requestingAdminId = req.user.id;
        const requestingAdmin = await Admin.findById(requestingAdminId);
        
        if (!requestingAdmin) {
            return next(errorHandler(404, "Requesting admin not found"));
        }
        
        // Only Super Admin can delete admins
        if (requestingAdmin.role !== 'Super Admin') {
            return next(errorHandler(403, "Only Super Admins can delete admin accounts"));
        }
        
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

// Track admin activity (updates lastActivity timestamp)
export const updateAdminActivity = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const admin = await Admin.findById(id);
        if (!admin) {
            return next(errorHandler(404, "Admin not found"));
        }
        
        admin.lastActivity = new Date();
        admin.isOnline = true;
        await admin.save();
        
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};

// Set admin offline on logout
export const setAdminOffline = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const admin = await Admin.findById(id);
        if (!admin) {
            return next(errorHandler(404, "Admin not found"));
        }
        
        admin.isOnline = false;
        await admin.save();
        
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};