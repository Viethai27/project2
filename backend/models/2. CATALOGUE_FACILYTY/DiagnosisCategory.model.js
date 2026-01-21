import mongoose from "mongoose";

const diagnosisCategorySchema = new mongoose.Schema({
    icd_code: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const DiagnosisCategory = mongoose.model("DiagnosisCategory", diagnosisCategorySchema);
export default DiagnosisCategory;
