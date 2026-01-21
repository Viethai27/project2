import mongoose from "mongoose";

const doctorTimeSlotSchema = new mongoose.Schema({
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoctorSchedule",
        required: true,
    },
    slot_start: {
        type: String, // "08:00"
        required: true,
    },
    slot_end: {
        type: String, // "08:15"
        required: true,
    },
    max_patient: {
        type: Number,
        default: 1,
        min: 1,
    },
    status: {
        type: String,
        enum: ["available", "full", "closed"],
        default: "available",
    },
}, { timestamps: true });

doctorTimeSlotSchema.index(
    { schedule: 1, slot_start: 1 },
    { unique: true }
);

const DoctorTimeSlot = mongoose.model("DoctorTimeSlot", doctorTimeSlotSchema);
export default DoctorTimeSlot;
