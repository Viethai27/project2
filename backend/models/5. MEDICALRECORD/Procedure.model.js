import mongoose from "mongoose";

const procedureSchema = new mongoose.Schema({
    visit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visit",
        required: true,
    },
    procedure_type: {
        type: String,
        required: true, // ví dụ: "Phẫu thuật", "Thủ thuật"
    },
    description: {
        type: String,
    },
    start_time: {
        type: Date,
    },
    end_time: {
        type: Date,
    },
    cost: {
        type: Number,
        min: 0,
        default: 0,
    },
}, { timestamps: true });

const Procedure = mongoose.model("Procedure", procedureSchema);
export default Procedure;
