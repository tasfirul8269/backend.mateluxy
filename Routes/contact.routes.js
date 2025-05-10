import express from 'express';
const router = express.Router();
import * as contactController from '../controllers/contact.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

// Public route - Submit contact form
router.post('/submit', contactController.createContact);

// Admin routes - Require authentication
router.get('/', verifyToken, contactController.getAllContacts);
router.get('/:id', verifyToken, contactController.getContactById);
router.patch('/:id/status', verifyToken, contactController.updateContactStatus);
router.delete('/:id', verifyToken, contactController.deleteContact);

export default router;
