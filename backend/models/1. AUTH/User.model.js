import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password_hash: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ["active", "inactive", "locked"],
        default: "active",
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
