import express from "express";
import { agents, getAgent, updateAgent, deleteAgent, checkUsernameAvailability } from "../controllers/agents.controller.js";

const router = express.Router();

router.get("/agents", agents);
router.get("/agents/:id", getAgent);
router.put("/agents/:id", updateAgent);
router.delete("/agents/:id", deleteAgent);
router.get("/check-username", checkUsernameAvailability);

export default router;