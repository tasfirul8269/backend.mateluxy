import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/erros.js";
import Admin from "../models/admin.model.js";

export const addAdmins = async (req, res,next) => {

    const {username, fullName, email, password} = req.body;

    const hashedPassword = await bcryptjs.hash(password, 10);

   const newAdmin = new Admin({
        username,
        fullName,
        email,
        password: hashedPassword,
    });


    try {
        await newAdmin.save();
        res.status(201).json('New Admin Has Been Added');
    } catch (error) {
        next(error);
    }
    


};