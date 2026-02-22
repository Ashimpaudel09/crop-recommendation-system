import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true
  },
  source: {
  type: String,
  enum: ["crop_sale", "livestock", "subsidy", "grant"],
  required: true
},
  incomeDate: {
    type: Date,
    required: true
  },
  quantity_sold: {
    type: Number,
    default: 0
  },
  uintPrice: {
    type: Number
  },
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true
  },
}, { timestamps: true });

const Income = mongoose.model('Income', incomeSchema);
export default Income;