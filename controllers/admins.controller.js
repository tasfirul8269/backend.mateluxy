import Admin from "../models/admin.model.js";
import { errorHandler } from "../utils/erros.js";

export const admins = async (req, res, next) => {
    try {
        const allAdmins = await Admin.find().select('-password');  // Exclude password field
        res.status(200).json(allAdmins);
    } catch (error) {
        next(error);
    }
};