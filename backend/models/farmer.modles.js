import mongoose from 'mongoose';

const farmerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Farmer is required"],
        trim: true
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        uinque: true,
        match:  [/^[0-9]{10}$/, "Please provide a valid phone number"],
    },
    location: {
        provience: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true,
        },
         municipality: {
        type: String,
        required: true,
      },
      ward: {
        type: Number,
        required: true,
      },
    },
    farmSize: {
        type: Number,
        required: true,
        min: 0
    },
     irrigationType: {
      type: String,
      enum: ["Rainfed", "Canal", "Tube well", "Drip", "Sprinkler"],
      default: "Rainfed",
    },
        preferredCropCategory: {
      type: String,
      enum: ["Cereal", "Vegetable", "Fruit", "Cash Crop"],
    },

},{
    timestamps: true
});


const farmer = mongoose.model("farmer",farmerSchema);
export default farmer;