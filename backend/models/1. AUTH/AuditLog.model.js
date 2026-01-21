import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    action: {
        type: String,
        required: true,
    },
    entity_name: {
        type: String,
        required: true,
    },
    entity_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
}, { timestamps: true });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
