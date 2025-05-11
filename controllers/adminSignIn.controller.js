import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/erros.js";
import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";

export const adminSignIn = async (req, res, next) => {
    const { email, password, rememberMe } = req.body;
    try {
        const validAdmin = await Admin.findOne({ email });
        if (!validAdmin) {
            return next(errorHandler(404, "Admin Not Found"));
        }
        const validPassword = await bcryptjs.compare(password, validAdmin.password);
        if (!validPassword) {
            return next(errorHandler(401, "Invalid credentials"));
        }
        
        // Create JWT token with admin ID
        const token = jwt.sign({ id: validAdmin._id }, process.env.JWT_SECRET);

        // Remove password from response
        const { password: pass, ...rest } = validAdmin._doc;
        
        // Set cookie options based on rememberMe
        const cookieOptions = {
            httpOnly: true,
            secure: true, // must be false on localhost (HTTP)
            sameSite: "None", // or "strict", either is fine
        };
        
        // If rememberMe is true, set expiration to 30 days, otherwise session cookie
        if (rememberMe) {
            cookieOptions.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
            console.log('Remember me enabled, setting cookie expiration to 30 days');
        } else {
            console.log('Remember me disabled, using session cookie');
        }
        
        // Set cookie and return response
        res.cookie("access_token", token, cookieOptions)
           .status(200)
           .json({ ...rest, rememberMe });

    } catch (error) {
        next(error);
    }
};