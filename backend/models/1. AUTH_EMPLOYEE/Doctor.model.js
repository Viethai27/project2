import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employer",
        required: false,
        sparse: true,
    },
    full_name: {
        type: String,
        required: true,
    },
    specialty: {
        type: String,
        required: false,
    },
    specialization: {
        type: String,
        required: false,
    },
    license_number: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    experience_years: {
        type: Number,
        required: false,
    },
    education: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    avatar: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, { timestamps: true });

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
