import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/erros.js";
import Admin from "../models/admin.model.js";

export const addAdmins = async (req, res, next) => {
    const { username, fullName, email, password, profileImage } = req.body;

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newAdmin = new Admin({
        username,
        fullName,
        email,
        password: hashedPassword,
        profileImage: profileImage || '',
    });

    try {
        await newAdmin.save();
        res.status(201).json(newAdmin);
    } catch (error) {
        next(error);
    }
};