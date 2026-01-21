import mongoose from "mongoose";

const prescriptionItemSchema = new mongoose.Schema({
    prescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
        required: true,
    },
    medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required: true,
    },
    dosage: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    instruction: {
        type: String,
    },
}, { timestamps: true });

const PrescriptionItem = mongoose.model(
    "PrescriptionItem",
    prescriptionItemSchema
);
export default PrescriptionItem;
