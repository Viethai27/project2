import mongoose from "mongoose";

const inpatientDailyRecordSchema = new mongoose.Schema({
    admission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admission",
        required: true,
    },
    note: {
        type: String,
        required: true,
    },
    record_date: {
        type: Date,
        required: true,
        default: Date.now,
    },
}, { timestamps: true });

const InpatientDailyRecord = mongoose.model(
    "InpatientDailyRecord",
    inpatientDailyRecordSchema
);

export default InpatientDailyRecord;
