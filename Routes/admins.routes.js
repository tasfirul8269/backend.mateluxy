import express from "express";
import { 
  admins, 
  updateAdmin, 
  deleteAdmin, 
  checkUsernameAvailability,
  getCurrentAdmin
} from "../controllers/admins.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", admins);
router.get("/profile", verifyToken, getCurrentAdmin);
router.get("/check-username", checkUsernameAvailability);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

export default router;