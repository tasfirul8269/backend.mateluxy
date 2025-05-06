import express from "express";
import { admins, updateAdmin, deleteAdmin, checkUsernameAvailability } from "../controllers/admins.controller.js";

const router = express.Router();

router.get("/", admins);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);
router.get("/check-username", checkUsernameAvailability);

export default router;