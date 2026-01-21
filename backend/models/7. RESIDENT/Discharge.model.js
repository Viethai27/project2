import mongoose from "mongoose";

const dischargeSchema = new mongoose.Schema({
    admission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admission",
        required: true,
        unique: true, // 1 lần nhập viện chỉ có 1 lần xuất viện
    },
    discharge_time: {
        type: Date,
        required: true,
        default: Date.now,
    },
    outcome: {
        type: String,
        required: true, 
        // ví dụ: "Khỏi", "Đỡ", "Chuyển viện", "Tử vong"
    },
}, { timestamps: true });

const Discharge = mongoose.model("Discharge", dischargeSchema);
export default Discharge;
