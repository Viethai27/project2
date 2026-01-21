import mongoose from "mongoose";

const diagnosisCategoryMapSchema = new mongoose.Schema({
    diagnosis: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diagnosis",
        required: true,
    },
    diagnosis_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DiagnosisCategory",
        required: true,
    },
}, { timestamps: true });

diagnosisCategoryMapSchema.index(
    { diagnosis: 1, diagnosis_category: 1 },
    { unique: true }
);

const DiagnosisCategoryMap = mongoose.model(
    "DiagnosisCategoryMap",
    diagnosisCategoryMapSchema
);

export default DiagnosisCategoryMap;
