import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
    visit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visit",
    },
    admission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admission",
    },
    total_amount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ["PENDING", "PAID", "CANCELLED"],
        default: "PENDING",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Billing = mongoose.model("Billing", billingSchema);
export default Billing;
