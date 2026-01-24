import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    full_name: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
    },
    id_card: {
        type: String,
        required: false,
        unique: true,
        sparse: true, // Allows multiple null values
    },
    phone: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
