import express from "express";
import {admins} from "../controllers/admins.controller.js";

const router = express.Router();

router.get("/admins",admins);

export default router;