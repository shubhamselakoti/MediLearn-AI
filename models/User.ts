import mongoose, { Schema, type Document } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  image?: string;
  xp: number;
  streak: number;
  lastActive: Date;
  level: number;
  achievements: string[];
  createdAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    image: { type: String },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    level: { type: Number, default: 1 },
    achievements: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUserDocument>("User", UserSchema);
