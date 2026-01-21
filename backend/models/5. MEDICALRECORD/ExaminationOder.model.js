import mongoose from "mongoose";

const examinationOrderSchema = new mongoose.Schema({
    visit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visit",
        required: true,
    },
    service_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceCategory",
        required: true,
    },
    order_time: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const ExaminationOrder = mongoose.model(
    "ExaminationOrder",
    examinationOrderSchema
);
export default ExaminationOrder;
