import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cropName: {
        type: String,
        required: true,
        trim: true
    },
    plantingDate: {
        type: Date,
        required: true,
    },
    harvestDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["growing", "harvested", "failed"],
        default: 'growing'
    },
}, {
    timestamps: true
});

const Crop = mongoose.model('Crop', cropSchema);
export default Crop;
