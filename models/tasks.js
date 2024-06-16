import mongoose from "mongoose";
import { taskSchema, userSchema } from "../schemas/tasks.js";

export const taskModel = mongoose.model("task", taskSchema);
export const userModel = mongoose.model("users", userSchema);