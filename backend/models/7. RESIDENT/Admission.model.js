import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    admission_time: {
        type: Date,
        required: true,
        default: Date.now,
    },
}, { timestamps: true });

const Admission = mongoose.model("Admission", admissionSchema);
export default Admission;
