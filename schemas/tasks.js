import mongoose from "mongoose";

export const taskSchema = new mongoose.Schema({
    status:{
        type: String,
        required: true,
        enum: ["pending", "in-progress", "completed"]
    },
    priority:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    createdAt:{
        type: Number,
        required: true
    },
    id:{
        type: String,
        required: true,
        unique: true
    }
});


export const userSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    }
});