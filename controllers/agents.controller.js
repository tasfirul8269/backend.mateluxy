import Agent from "../models/agents.model.js";
import { errorHandler } from "../utils/erros.js";

export const agents = async (req, res, next) => {
    try {
        // Fetch all agents from the database
        const allAgents = await Agent.find().select('-password');  // Exclude password field
        res.status(200).json(allAgents);
    } catch (error) {
        next(error);
    }
};