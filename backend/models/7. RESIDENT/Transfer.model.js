import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({
    admission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admission",
        required: true,
    },
    from_bed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bed",
        required: true,
    },
    to_bed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bed",
        required: true,
    },
    transfer_time: {
        type: Date,
        required: true,
        default: Date.now,
    },
    reason: {
        type: String,
    },
}, { timestamps: true });

const Transfer = mongoose.model("Transfer", transferSchema);
export default Transfer;
