import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ward",
        required: true,
    },
    room_number: {
        type: String,
        required: true,
    },
}, { timestamps: true });

roomSchema.index({ ward: 1, room_number: 1 }, { unique: true });

const Room = mongoose.model("Room", roomSchema);
export default Room;
