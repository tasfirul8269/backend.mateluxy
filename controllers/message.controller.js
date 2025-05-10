import Message from '../models/message.model.js';

// Create a new message from contact form
export const createMessage = async (req, res) => {
  try {
    console.log('Message submission received:', req.body);
    
    const { name, email, phone, subject, message, preferredContact } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      console.log('Validation error: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields'
      });
    }
    
    // Create new message
    const newMessage = new Message({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
      preferredContact: preferredContact || 'email'
    });
    
    // Save message to database
    await newMessage.save();
    console.log('Message saved successfully:', newMessage._id);
    
    // Return success
    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully',
      data: newMessage
    });
    
  } catch (error) {
    console.error('Error creating message:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while sending your message',
      error: error.message
    });
  }
};

// Get all messages (admin)
export const getAllMessages = async (req, res) => {
  try {
    console.log('Getting all messages');
    const messages = await Message.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving messages',
      error: error.message
    });
  }
};

// Get single message by ID (admin)
export const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Getting message by ID:', id);
    
    const message = await Message.findById(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error getting message:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the message',
      error: error.message
    });
  }
};

// Update message status (admin)
export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log('Updating message status:', id, status);
    
    // Validate status
    if (!status || !['new', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Message status updated successfully',
      data: updatedMessage
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the message status',
      error: error.message
    });
  }
};

// Delete message (admin)
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting message:', id);
    
    const message = await Message.findByIdAndDelete(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the message',
      error: error.message
    });
  }
}; 