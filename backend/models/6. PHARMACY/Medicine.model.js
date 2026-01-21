import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    unit: {
        type: String,
        required: true,
    },
    active_ingredient: {
        type: String,
    },
}, { timestamps: true });

const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;
