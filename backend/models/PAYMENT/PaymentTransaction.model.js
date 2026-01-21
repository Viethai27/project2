import mongoose from "mongoose";

const paymentTransactionSchema = new mongoose.Schema({
    billing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Billing",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    payment_method: {
        type: String,
        enum: ["CASH", "BANK_TRANSFER", "VNPAY", "MOMO", "OTHER"],
        required: true,
    },
    payment_time: {
        type: Date,
        required: true,
        default: Date.now,
    },
}, { timestamps: true });

const PaymentTransaction = mongoose.model(
    "PaymentTransaction",
    paymentTransactionSchema
);

export default PaymentTransaction;
