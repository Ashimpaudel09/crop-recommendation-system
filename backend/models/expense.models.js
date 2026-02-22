import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ["seed","fertilizer","labor","machinery","pesticide"],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  expenseDate: {
    type: Date,
    required: true
  },
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true
  },
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;