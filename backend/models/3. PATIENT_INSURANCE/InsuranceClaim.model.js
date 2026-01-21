import mongoose from "mongoose";

const insuranceClaimSchema = new mongoose.Schema({
    insurance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Insurance",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    submitted_at: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const InsuranceClaim = mongoose.model("InsuranceClaim", insuranceClaimSchema);
export default InsuranceClaim;
