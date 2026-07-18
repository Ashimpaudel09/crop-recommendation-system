import Income from '../models/income.models.js';
import mongoose from 'mongoose';

// CREATE income
export const createIncome = async (req, res) => {
  try {
    const income = await Income.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      message: 'Income added successfully',
      income,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all incomes for authenticated user
export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id })
      .sort({ incomeDate: -1 })
      .populate('cropId', 'cropName');

    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE income
export const updateIncome = async (req, res) => {
  try {
    const updated = await Income.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.status(200).json({ message: 'Income updated', income: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE income
export const deleteIncome = async (req, res) => {
  try {
    const deleted = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.status(200).json({ message: 'Income removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET income stats (monthly aggregation)
export const getIncomeStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const stats = await Income.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$incomeDate' },
            month: { $month: '$incomeDate' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    const bySource = await Income.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$source',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({ monthly: stats, bySource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};