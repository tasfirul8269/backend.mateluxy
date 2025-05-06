import express from "express";
import { agents, getAgent, updateAgent, deleteAgent, checkUsernameAvailability } from "../controllers/agents.controller.js";
import { agentSignIn } from "../controllers/agentSignIn.controller.js";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/erros.js";
import Agent from "../models/agents.model.js";

const router = express.Router();

router.get("/agents", agents);
router.get("/agents/:id", getAgent);
router.put("/agents/:id", updateAgent);
router.delete("/agents/:id", deleteAgent);
router.get("/check-username", checkUsernameAvailability);

// Add agent login route
router.post("/agents/login", agentSignIn);

// Add agent auth status route
router.get("/agents/auth-status", async (req, res, next) => {
    try {
        const token = req.cookies.agent_token;
        if (!token) {
            return next(errorHandler(401, "Unauthorized"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const agent = await Agent.findById(decoded.id).select("-password");
        
        if (!agent) {
            return next(errorHandler(404, "Agent not found"));
        }

        res.status(200).json(agent);
    } catch (error) {
        next(errorHandler(401, "Unauthorized"));
    }
});

export default router;