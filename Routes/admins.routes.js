import express from "express";
import { admins, updateAdmin, deleteAdmin } from "../controllers/admins.controller.js";

const router = express.Router();

router.get("/", admins);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);
router.get("/check-username", adminsController.checkUsernameAvailability);

export default router;