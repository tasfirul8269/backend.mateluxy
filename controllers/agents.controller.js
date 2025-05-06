import Agent from "../models/agents.model.js";
import { errorHandler } from "../utils/erros.js";
import bcryptjs from "bcryptjs";

export const agents = async (req, res, next) => {
    try {
        // Fetch all agents from the database
        const allAgents = await Agent.find().select('-password');  // Exclude password field
        res.status(200).json(allAgents);
    } catch (error) {
        next(error);
    }
};

export const updateAgent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, fullName, email, password, profileImage, position, contactNumber } = req.body;

        // Create update object
        const updateData = {
            username,
            fullName,
            email,
            profileImage,
            position,
            contactNumber
        };

        // Only hash and update password if it's provided
        if (password) {
            updateData.password = await bcryptjs.hash(password, 10);
        }

        const updatedAgent = await Agent.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!updatedAgent) {
            return res.status(404).json({ message: "Agent not found" });
        }

        res.status(200).json(updatedAgent);
    } catch (error) {
        next(error);
    }
};

export const deleteAgent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedAgent = await Agent.findByIdAndDelete(id);

        if (!deletedAgent) {
            return res.status(404).json({ message: "Agent not found" });
        }

        res.status(200).json({ message: "Agent deleted successfully" });
    } catch (error) {
        next(error);
    }
};