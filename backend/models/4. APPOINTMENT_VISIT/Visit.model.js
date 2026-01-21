import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true,
        unique: true,
    },
    visit_time: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;
