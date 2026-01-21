import mongoose from "mongoose";

const vitalSignSchema = new mongoose.Schema({
    medical_record: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalRecord",
        required: true,
    },
    pulse: {
        type: Number,
    },
    temperature: {
        type: Number,
    },
    blood_pressure: {
        type: String, // "120/80"
    },
    recorded_at: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const VitalSign = mongoose.model("VitalSign", vitalSignSchema);
export default VitalSign;
