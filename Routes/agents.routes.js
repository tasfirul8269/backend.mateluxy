import express from "express";
import { agents, updateAgent, deleteAgent } from "../controllers/agents.controller.js";

const router = express.Router();

router.get("/agents", agents);
router.put("/agents/:id", updateAgent);
router.delete("/agents/:id", deleteAgent);

export default router;