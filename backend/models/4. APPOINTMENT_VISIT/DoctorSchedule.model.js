import mongoose from "mongoose";

const doctorScheduleSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    work_date: {
        type: Date,
        required: true,
    },
    start_time: {
        type: String, // "08:00"
        required: true,
    },
    end_time: {
        type: String, // "11:30"
        required: true,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
}, { timestamps: true });

doctorScheduleSchema.index(
    { doctor: 1, work_date: 1 },
    { unique: true }
);

const DoctorSchedule = mongoose.model("DoctorSchedule", doctorScheduleSchema);
export default DoctorSchedule;
