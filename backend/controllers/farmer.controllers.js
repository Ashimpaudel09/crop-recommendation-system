import Farmer from '../models/farmer.models.js';


export const postFarmer = async (req, res) => {
  try {
    req.body.user = req.user.id;

    const existingFarmer = await Farmer.findOne({ user: req.user.id });
    if (existingFarmer) {
      return res.status(400).json({ message: 'Farmer details already exist for this user' });
    }

    const farmer = await Farmer.create(req.body);

    res.status(201).json({
      message: 'Farmer details added successfully',
      farmer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ user: req.user.id });

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer details not found' });
    }

    res.status(200).json(farmer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};