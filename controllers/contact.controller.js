const Contact = require('../models/contact.model');

// Create a new contact message
exports.createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      interest,
      message,
      contactPhone,
      contactWhatsApp,
      contactEmail
    } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields'
      });
    }

    // Create contact message with contact preferences
    const newContact = new Contact({
      name,
      email,
      phone,
      interest,
      message,
      contactPreferences: {
        contactPhone: contactPhone || false,
        contactWhatsApp: contactWhatsApp || false,
        contactEmail: contactEmail || false
      }
    });

    // Save to database
    await newContact.save();

    return res.status(201).json({
      success: true,
      message: 'Contact message submitted successfully',
      data: newContact
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    return res.status(500).json({
      success: false,
      message: 'Error submitting contact message',
      error: error.message
    });
  }
};

// Get all contact messages (for admin panel)
exports.getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    // Build query based on filters
    const query = {};
    if (status) {
      query.status = status;
    }
    
    // Count total documents
    const total = await Contact.countDocuments(query);
    
    // Find contact messages with pagination
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    return res.status(200).json({
      success: true,
      data: {
        contacts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching contact messages',
      error: error.message
    });
  }
};

// Get a single contact message by ID
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact message:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching contact message',
      error: error.message
    });
  }
};

// Update contact message status
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!['new', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Status must be one of: new, in-progress, resolved'
      });
    }
    
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      data: updatedContact
    });
  } catch (error) {
    console.error('Error updating contact status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating contact status',
      error: error.message
    });
  }
};

// Delete a contact message
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedContact = await Contact.findByIdAndDelete(id);
    
    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting contact message',
      error: error.message
    });
  }
};
