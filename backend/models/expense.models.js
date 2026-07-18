import mongoose from 'mongoose';

// Expense categories aligned with common farming operations
const EXPENSE_CATEGORIES = [
  'seeds',
  'fertilizer',
  'pesticides',
  'labor',
  'machinery',
  'irrigation',
  'transportation',
  'miscellaneous',
];

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    category: {
      type: String,
      enum: EXPENSE_CATEGORIES,
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    expenseDate: {
      type: Date,
      required: [true, 'Expense date is required'],
    },
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index for efficient user-scoped queries
expenseSchema.index({ user: 1, expenseDate: -1 });

const Expense = mongoose.model('Expense', expenseSchema);
export { EXPENSE_CATEGORIES };
export default Expense;