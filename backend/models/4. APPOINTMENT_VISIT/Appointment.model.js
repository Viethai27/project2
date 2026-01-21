import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: false,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: false,
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoctorTimeSlot",
        required: false,
    },
    // Fields for public booking (without patient account)
    patient_name: {
        type: String,
        required: false,
    },
    patient_email: {
        type: String,
        required: false,
    },
    patient_phone: {
        type: String,
        required: false,
    },
    patient_gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: false,
    },
    patient_dob: {
        type: String,
        required: false,
    },
    reason: {
        type: String,
        required: false,
    },
    appointment_date: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
    },
    time_slot: {
        type: String,
        required: false,
    },
    department: {
        type: String,
        required: false,
    },
    doctor_name: {
        type: String,
        required: false,
    },
    queue_number: {
        type: Number,
        required: false,
    },
    status: {
        type: String,
        enum: ["booked", "checked_in", "cancelled", "no_show", "pending", "confirmed"],
        default: "pending",
    },
    booked_at: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Remove old unique index
// appointmentSchema.index(
//     { slot: 1, queue_number: 1 },
//     { unique: true }
// );

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
