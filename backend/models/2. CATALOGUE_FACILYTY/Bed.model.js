import mongoose from "mongoose";

const bedSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    bed_number: {
        type: String,
        required: true,
    },
}, { timestamps: true });

bedSchema.index({ room: 1, bed_number: 1 }, { unique: true });

const Bed = mongoose.model("Bed", bedSchema);
export default Bed;
