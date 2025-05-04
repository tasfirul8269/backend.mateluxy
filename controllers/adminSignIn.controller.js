import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/erros.js";
import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";


export const adminSignIn = async (req, res, next) => {
    const { email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    try {
        const validAdmin = await Admin.findOne({ email });
        if (!validAdmin) {
            return next(errorHandler(404, "Admin Not Found"));
        }
        const validPassword = await bcryptjs.compare(password, validAdmin.password);
        if (!validPassword) {
            return next(errorHandler(401, "Invalid credentials"));
        }
        const token = jwt.sign({ id: validAdmin._id }, process.env.JWT_SECRET);

        const { password: pass, ...rest } = validAdmin._doc;

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true, // must be false on localhost (HTTP)
            sameSite: "None" // or "strict", either is fine
        }).status(200).json(rest);

    } catch (error) {
        next(error);
    }
};