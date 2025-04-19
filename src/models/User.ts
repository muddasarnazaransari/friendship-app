import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: "admin" | "user";
  isApproved: boolean;
  isBlocked: boolean; // ✅ added
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isApproved: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false }, // ✅ added
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
