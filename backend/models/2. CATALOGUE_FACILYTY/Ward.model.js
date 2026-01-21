import mongoose from "mongoose";

const wardSchema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Ward = mongoose.model("Ward", wardSchema);
export default Ward;
