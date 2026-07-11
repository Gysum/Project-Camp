import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { subTask } from "../models/subtask.models.js";
import { ProjectNote } from "../models/note.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

// Create a new note for a project
const createNote = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Note content is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const note = await ProjectNote.create({
    project: new mongoose.Types.ObjectId(projectId),
    createdBy: new mongoose.Types.ObjectId(req.user?._id),
    content,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully"));
});

// Get all notes for a project
const getNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const notes = await ProjectNote.find({
    project: new mongoose.Types.ObjectId(projectId),
  })
    .populate("createdBy", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

// Update a note
const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Note content is required");
  }

  const note = await ProjectNote.findById(noteId);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  // Ensure only the creator can update the note
  if (note.createdBy.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You do not have permission to update this note");
  }

  note.content = content;
  await note.save();

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note updated successfully"));
});

// Delete a note
const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const note = await ProjectNote.findById(noteId);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  // Ensure only the creator can delete the note
  if (note.createdBy.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You do not have permission to delete this note");
  }

  await ProjectNote.findByIdAndDelete(noteId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Note deleted successfully"));
});

export {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
};
