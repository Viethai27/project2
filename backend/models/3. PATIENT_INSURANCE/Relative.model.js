import mongoose from "mongoose";

const relativeSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Relative = mongoose.model("Relative", relativeSchema);
export default Relative;
