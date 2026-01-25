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
        required: false, // Changed: Emergency patients may not have DOB initially
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
    },
    id_card: {
        type: String,
        required: false,
        sparse: true, // Allows multiple null values
        // Removed unique:true to allow multiple "N/A" values
        validate: {
            // Only enforce uniqueness for real ID cards (not N/A)
            validator: async function(value) {
                if (!value || value === 'N/A' || value === 'Chưa có') {
                    return true; // Allow N/A without uniqueness check
                }
                const count = await mongoose.models.Patient.countDocuments({
                    id_card: value,
                    _id: { $ne: this._id }
                });
                return count === 0;
            },
            message: 'CCCD đã được đăng ký'
        }
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
