import mongoose from "mongoose";

const patientRelativeSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    relative: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Relative",
        required: true,
    },
    relationship: {
        type: String,
        required: true, // cha, mẹ, vợ, chồng, người giám hộ...
    },
}, { timestamps: true });

patientRelativeSchema.index(
    { patient: 1, relative: 1 },
    { unique: true }
);

const PatientRelative = mongoose.model("PatientRelative", patientRelativeSchema);
export default PatientRelative;
