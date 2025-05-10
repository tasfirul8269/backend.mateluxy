const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { verifyToken } = require('./authStatus');

// Public route - Submit contact form
router.post('/submit', contactController.createContact);

// Admin routes - Require authentication
router.get('/', verifyToken, contactController.getAllContacts);
router.get('/:id', verifyToken, contactController.getContactById);
router.patch('/:id/status', verifyToken, contactController.updateContactStatus);
router.delete('/:id', verifyToken, contactController.deleteContact);

module.exports = router;
