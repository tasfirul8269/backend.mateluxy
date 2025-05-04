import express from "express";
import { agents } from "../controllers/agents.controller.js";

const router = express.Router();

router.get("/agents",agents);

export default router;