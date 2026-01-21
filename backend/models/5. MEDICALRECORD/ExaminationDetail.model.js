import mongoose from "mongoose";

const examinationDetailSchema = new mongoose.Schema({
    examination_order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExaminationOrder",
        required: true,
        unique: true,
    },
    result: {
        type: String,
    },
}, { timestamps: true });

const ExaminationDetail = mongoose.model(
    "ExaminationDetail",
    examinationDetailSchema
);
export default ExaminationDetail;
