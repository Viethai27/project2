import mongoose from "mongoose";

const medicalFormDataSchema = new mongoose.Schema({
    form_template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalFormTemplate",
        required: true,
    },
    medical_record: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalRecord",
        required: true,
    },
    visit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visit",
        required: true,
    },
    form_data: {
        type: Object,
        required: true, // dữ liệu thực tế theo schema_definition
    },
    filled_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    filled_at: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const MedicalFormData = mongoose.model(
    "MedicalFormData",
    medicalFormDataSchema
);

export default MedicalFormData;
