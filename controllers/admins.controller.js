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
        const deletedAdmin = await Admin.findByIdAndDelete(id);

        if (!deletedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        next(error);
    }
};