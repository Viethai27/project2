import mongoose from "mongoose";

const medicalFormTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    schema_definition: {
        type: Object, 
        required: true, 
        // JSON Schema mô tả form động
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, { timestamps: true });

const MedicalFormTemplate = mongoose.model(
    "MedicalFormTemplate",
    medicalFormTemplateSchema
);

export default MedicalFormTemplate;
