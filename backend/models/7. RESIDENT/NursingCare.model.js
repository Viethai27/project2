import mongoose from "mongoose";

const nursingCareSchema = new mongoose.Schema({
    admission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admission",
        required: true,
    },
    care_note: {
        type: String,
        required: true,
    },
    care_time: {
        type: Date,
        required: true,
        default: Date.now,
    },
}, { timestamps: true });

const NursingCare = mongoose.model("NursingCare", nursingCareSchema);
export default NursingCare;
