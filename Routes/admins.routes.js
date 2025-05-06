import express from "express";
import { 
  admins, 
  updateAdmin, 
  deleteAdmin, 
  checkUsernameAvailability, 
  updateAdminActivity,
  setAdminOffline
} from "../controllers/admins.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", admins);
router.put("/:id", verifyToken, updateAdmin);
router.delete("/:id", verifyToken, deleteAdmin);
router.get("/check-username", checkUsernameAvailability);
router.put("/:id/activity", updateAdminActivity);
router.put("/:id/offline", setAdminOffline);

export default router;