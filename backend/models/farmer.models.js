import mongoose from 'mongoose';

// FarmerProfile is a 1-to-1 extension of the User model.
// All fields are optional so users can build their profile incrementally.
const farmerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    location: {
      province: { type: String, trim: true },
      district: { type: String, trim: true },
      municipality: { type: String, trim: true },
      ward: { type: Number },
    },
    farmSize: {
      type: Number,
      min: [0, 'Farm size cannot be negative'],
    },
    irrigationType: {
      type: String,
      enum: ['Rainfed', 'Canal', 'Tube well', 'Drip', 'Sprinkler'],
      default: 'Rainfed',
    },
    preferredCropCategory: {
      type: String,
      enum: ['Cereal', 'Vegetable', 'Fruit', 'Cash Crop'],
    },
  },
  {
    timestamps: true,
  }
);

const FarmerProfile = mongoose.model('FarmerProfile', farmerProfileSchema);
export default FarmerProfile;