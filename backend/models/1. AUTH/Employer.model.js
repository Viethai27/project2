import mongoose from "mongoose";

const employerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Employer = mongoose.model("Employer", employerSchema);
export default Employer;
