import Contact from '../models/contact.model.js';

// Create a new contact message
export const createContact = async (req, res) => {
  try {
    console.log('Creating contact with data:', req.body);
    
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
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields'
      });
    }

    // Create contact message with contact preferences
    const contactData = {
      name,
      email,
      phone: phone || '',
      interest: interest || '',
      message,
      contactPreferences: {
        contactPhone: contactPhone || false,
        contactWhatsApp: contactWhatsApp || false,
        contactEmail: contactEmail || false
      }
    };
    
    console.log('Creating contact with processed data:', contactData);
    const newContact = new Contact(contactData);

    // Save to database
    const savedContact = await newContact.save();
    console.log('Contact saved successfully:', savedContact._id);

    return res.status(201).json({
      success: true,
      message: 'Contact message submitted successfully',
      data: savedContact
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
export const getAllContacts = async (req, res) => {
  try {
    console.log('Getting all contacts with query params:', req.query);
    const { page = 1, limit = 10, status } = req.query;
    
    // Convert string values to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    // Build query
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    console.log('Using query filter:', query);
    
    // Get total count for pagination
    const totalContacts = await Contact.countDocuments(query);
    console.log('Total contacts matching query:', totalContacts);
    
    // Get paginated contacts
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .exec();
    
    console.log(`Found ${contacts.length} contacts for page ${pageNum}`);
    
    return res.status(200).json({
      success: true,
      data: {
        contacts,
        totalPages: Math.ceil(totalContacts / limitNum),
        currentPage: pageNum,
        totalContacts
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
export const getContactById = async (req, res) => {
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
export const updateContactStatus = async (req, res) => {
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
export const deleteContact = async (req, res) => {
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
