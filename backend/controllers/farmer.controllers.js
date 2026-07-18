import FarmerProfile from '../models/farmer.models.js';

// GET farmer profile for authenticated user
export const getProfile = async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ user: req.user.id });

    if (!profile) {
      // Return empty profile structure so frontend can show the form
      return res.status(200).json(null);
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE or UPDATE farmer profile (upsert)
export const upsertProfile = async (req, res) => {
  try {
    const profile = await FarmerProfile.findOneAndUpdate(
      { user: req.user.id },
      { ...req.body, user: req.user.id },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
