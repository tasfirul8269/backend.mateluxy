import PropertyRequest from '../models/propertyRequest.model.js';
import { errorHandler } from '../utils/erros.js';

// Create a new property request
export const createPropertyRequest = async (req, res, next) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      countryCode, 
      propertyId, 
      propertyTitle, 
      privacyConsent, 
      marketingConsent 
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !propertyId || !propertyTitle) {
      return next(errorHandler(400, 'Name, email, phone, property ID and property title are required'));
    }
    
    if (!privacyConsent) {
      return next(errorHandler(400, 'Privacy consent is required'));
    }
    
    const newPropertyRequest = new PropertyRequest({
      name,
      email,
      phone,
      countryCode: countryCode || '+971',
      propertyId,
      propertyTitle,
      privacyConsent,
      marketingConsent: marketingConsent || false
    });
    
    await newPropertyRequest.save();
    
    res.status(201).json({
      success: true,
      message: 'Property request submitted successfully',
      data: newPropertyRequest
    });
  } catch (error) {
    console.error('Error in createPropertyRequest:', error);
    next(error);
  }
};

// Get all property requests (for admin)
export const getAllPropertyRequests = async (req, res, next) => {
  try {
    const { status, sort = '-createdAt' } = req.query;
    
    // Build filter based on query parameters
    const filter = {};
    if (status) {
      filter.status = status;
    }
    
    // Sort options
    const sortOptions = {};
    if (sort.startsWith('-')) {
      sortOptions[sort.substring(1)] = -1;
    } else {
      sortOptions[sort] = 1;
    }
    
    const propertyRequests = await PropertyRequest.find(filter)
      .sort(sortOptions)
      .lean();
    
    res.status(200).json({
      success: true,
      count: propertyRequests.length,
      data: propertyRequests
    });
  } catch (error) {
    console.error('Error in getAllPropertyRequests:', error);
    next(error);
  }
};

// Get a single property request by ID
export const getPropertyRequestById = async (req, res, next) => {
  try {
    const propertyRequest = await PropertyRequest.findById(req.params.id);
    
    if (!propertyRequest) {
      return next(errorHandler(404, 'Property request not found'));
    }
    
    res.status(200).json({
      success: true,
      data: propertyRequest
    });
  } catch (error) {
    console.error('Error in getPropertyRequestById:', error);
    next(error);
  }
};

// Update property request status
export const updatePropertyRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status || !['new', 'contacted', 'closed'].includes(status)) {
      return next(errorHandler(400, 'Valid status is required'));
    }
    
    const propertyRequest = await PropertyRequest.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!propertyRequest) {
      return next(errorHandler(404, 'Property request not found'));
    }
    
    res.status(200).json({
      success: true,
      data: propertyRequest
    });
  } catch (error) {
    console.error('Error in updatePropertyRequestStatus:', error);
    next(error);
  }
};

// Delete a property request
export const deletePropertyRequest = async (req, res, next) => {
  try {
    const propertyRequest = await PropertyRequest.findByIdAndDelete(req.params.id);
    
    if (!propertyRequest) {
      return next(errorHandler(404, 'Property request not found'));
    }
    
    res.status(200).json({
      success: true,
      message: 'Property request deleted successfully'
    });
  } catch (error) {
    console.error('Error in deletePropertyRequest:', error);
    next(error);
  }
}; 