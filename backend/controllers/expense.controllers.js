import Expense from '../models/expense.models.js';
import Crop from '../models/crop.models.js';


export const postExpense = async (req, res) => {
  try {

    req.body.user = req.user.id;

    const crop = await Crop.findOne({ _id: req.body.cropId, user: req.user.id });
    if (!crop) {
      return res.status(400).json({ message: 'Invalid crop selected' });
    }

    const expense = await Expense.create(req.body);

    res.status(201).json({
      message: 'Expense added successfully',
      expense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id })
      .sort({ expenseDate: -1 }) 
      .populate('cropId', 'cropName');

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
