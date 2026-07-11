import mongoose, { Schema } from "mongoose";
import { AvailableTasksStatus, TaskStatusEnum } from "../utils/constants.js";


const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: AvailableTasksStatus,
      default: TaskStatusEnum.TODO
    },
    attachments: {
      type: [{
        url: String, 
        mimetype: String,
        size: Number
      }],
      default: []
    }
  },
  { timestamps: true },
);

export const Task = new mongoose.model("Task", taskSchema)