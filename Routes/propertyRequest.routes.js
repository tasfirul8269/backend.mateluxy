import express from 'express';
const router = express.Router();
import * as propertyRequestController from '../controllers/propertyRequest.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

// Log when routes are being registered
console.log('Setting up property request routes');

// Public route - Submit property request form
router.post('/submit', (req, res, next) => {
  console.log('Property request submit route called');
  propertyRequestController.createPropertyRequest(req, res, next);
});

// Admin routes - Require authentication
router.get('/', verifyToken, (req, res, next) => {
  console.log('Getting all property requests');
  propertyRequestController.getAllPropertyRequests(req, res, next);
});

router.get('/:id', verifyToken, (req, res, next) => {
  console.log('Getting property request by ID:', req.params.id);
  propertyRequestController.getPropertyRequestById(req, res, next);
});

router.patch('/:id/status', verifyToken, (req, res, next) => {
  console.log('Updating property request status:', req.params.id, req.body.status);
  propertyRequestController.updatePropertyRequestStatus(req, res, next);
});

router.delete('/:id', verifyToken, (req, res, next) => {
  console.log('Deleting property request:', req.params.id);
  propertyRequestController.deletePropertyRequest(req, res, next);
});

export default router; 