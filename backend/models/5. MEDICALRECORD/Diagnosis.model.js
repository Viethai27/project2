import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema({
    visit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visit",
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);
export default Diagnosis;
