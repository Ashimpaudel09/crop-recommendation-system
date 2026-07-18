import mongoose from 'mongoose';

// Income sources aligned with common farming revenue streams
const INCOME_SOURCES = [
  'crop_sales',
  'livestock',
  'government_support',
  'other_income',
];

const incomeSchema = new mongoose.Schema(
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
    source: {
      type: String,
      enum: INCOME_SOURCES,
      required: [true, 'Income source is required'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    incomeDate: {
      type: Date,
      required: [true, 'Income date is required'],
    },
    quantitySold: {
      type: Number,
      default: 0,
      min: 0,
    },
    unitPrice: {
      type: Number,
      min: 0,
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
incomeSchema.index({ user: 1, incomeDate: -1 });

const Income = mongoose.model('Income', incomeSchema);
export { INCOME_SOURCES };
export default Income;