import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
    claim: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InsuranceClaim",
        required: true,
        unique: true,
    },
    total_amount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ["unpaid", "paid", "cancelled"],
        default: "unpaid",
    },
}, { timestamps: true });

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
