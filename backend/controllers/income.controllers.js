import Income from '../models/income.models.js';
import Crop from '../models/crop.models.js';


export const postIncome = async (req, res) => {
  try {
    req.body.user = req.user.id;

    const crop = await Crop.findOne({ _id: req.body.cropId, user: req.user.id });
    if (!crop) {
      return res.status(400).json({ message: 'Invalid crop selected' });
    }

    const income = await Income.create(req.body);

    res.status(201).json({
      message: 'Income added successfully',
      income,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getIncome = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id })
      .sort({ incomeDate: -1 }) 
      .populate('cropId', 'cropName');

    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};