import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/erros.js";
import Agent from "../models/agents.model.js";
import jwt from "jsonwebtoken";

export const agentSignIn = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validAgent = await Agent.findOne({ email });
        if (!validAgent) {
            return next(errorHandler(404, "Agent Not Found"));
        }
        const validPassword = await bcryptjs.compare(password, validAgent.password);
        if (!validPassword) {
            return next(errorHandler(401, "Invalid credentials"));
        }
        
        const token = jwt.sign({ id: validAgent._id }, process.env.JWT_SECRET);

        const { password: pass, ...rest } = validAgent._doc;

        res.cookie("agent_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }).status(200).json(rest);

    } catch (error) {
        next(error);
    }
}; 