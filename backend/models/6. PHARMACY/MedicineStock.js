import mongoose from "mongoose";

const medicineStockSchema = new mongoose.Schema({
    medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required: true,
        unique: true,
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0,
    },
    last_updated: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const MedicineStock = mongoose.model("MedicineStock", medicineStockSchema);
export default MedicineStock;
