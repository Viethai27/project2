import mongoose from "mongoose";

const admissionBedSchema = new mongoose.Schema({
    admission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admission",
        required: true,
    },
    bed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bed",
        required: true,
    },
    from_time: {
        type: Date,
        required: true,
    },
    to_time: {
        type: Date,
    },
}, { timestamps: true });

const AdmissionBed = mongoose.model("AdmissionBed", admissionBedSchema);
export default AdmissionBed;
