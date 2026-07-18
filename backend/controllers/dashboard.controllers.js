import Crop from '../models/crop.models.js';
import Expense from '../models/expense.models.js';
import Income from '../models/income.models.js';
import mongoose from 'mongoose';

// GET dashboard statistics for authenticated user
export const getDashboardStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Run all aggregations in parallel for performance
    const [crops, expenseTotal, incomeTotal, recentExpenses, recentIncomes] =
      await Promise.all([
        Crop.countDocuments({ user: userId }),

        Expense.aggregate([
          { $match: { user: userId } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),

        Income.aggregate([
          { $match: { user: userId } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),

        Expense.find({ user: userId })
          .sort({ expenseDate: -1 })
          .limit(5)
          .select('amount category description expenseDate'),

        Income.find({ user: userId })
          .sort({ incomeDate: -1 })
          .limit(5)
          .select('amount source description incomeDate'),
      ]);

    const totalExpenses = expenseTotal[0]?.total || 0;
    const totalIncome = incomeTotal[0]?.total || 0;

    res.status(200).json({
      totalCrops: crops,
      totalExpenses,
      totalIncome,
      netProfit: totalIncome - totalExpenses,
      recentExpenses,
      recentIncomes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
