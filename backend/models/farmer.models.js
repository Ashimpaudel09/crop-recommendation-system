import mongoose from 'mongoose';


const farmerSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: {
        type: String,
        required: true,
    }
},{
    timestamps: true
})


const Farmer = mongoose.model("Farmer", farmerSchema);
export default Farmer;