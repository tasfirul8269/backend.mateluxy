
import Property from '../models/Property.js';

// Get all properties - simplified with async/await pattern
export async function getAllProperties(req, res) {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get a single property - simplified with clear error handling
export async function getPropertyById(req, res) {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Create a new property - simplified with direct error handling
export async function createProperty(req, res) {
  try {
    const newProperty = await new Property(req.body).save();
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Update a property - simplified with single query
export async function updateProperty(req, res) {
  try {
    const property = await findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Delete a property - simplified
export async function deleteProperty(req, res) {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}