import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    provider: {
        type: String,
        required: true,
    },
    card_number: {
        type: String,
        required: true,
        unique: true,
    },
    valid_from: {
        type: Date,
        required: true,
    },
    valid_to: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

const Insurance = mongoose.model("Insurance", insuranceSchema);
export default Insurance;
