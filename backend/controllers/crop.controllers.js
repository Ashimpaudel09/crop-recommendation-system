import Crop from '../models/crop.models.js';


export const postCrop = async (req, res) => {
  try {

    const cropData = {
      ...req.body,
      user: req.user.id,
    };

    const crop = await Crop.create(cropData);

    res.status(201).json({
      message: 'Crop added successfully',
      crop,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCrop = async (req, res) => {
  try {
    const crops = await Crop.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(crops);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};