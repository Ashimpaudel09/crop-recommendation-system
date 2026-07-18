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

export const updateCropStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['growing', 'harvested', 'failed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },
      { new: true }
    );

    if (!crop) {
      return res.status(404).json({ message: 'Crop cycle not found' });
    }

    res.status(200).json({ message: 'Crop status updated successfully', crop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};