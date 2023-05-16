const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BoardModel = require("../models/BoardModel");
const TaskModel = require("../models/TaskModel");
const SubtaskModel = require("../models/SubtaskModel");
require("dotenv").config();

const boardsRouter = express.Router();

boardsRouter.get("/", async (req, res) => {
	try {
		const boards = await BoardModel.find();
		res.send(boards);
	} catch (error) {
		res.send({
			error: error.message
		});
	}
});

boardsRouter.get("/:boardId", async (req, res) => {
	try {
		const { boardId } = req.params;
		const board = await BoardModel.findOne({ _id: boardId }).populate("tasks");
		for (let i = 0; i < board.tasks.length; i++) {
			const tasks = await TaskModel.findOne({ _id: board.tasks[i]._id }).populate("subtasks");
			board.tasks[i] = tasks;
		}
		res.send(board);
	} catch (error) {
		res.send({
			error: error.message
		});
	}
});

boardsRouter.post("/", async (req, res) => {
	try {
		const board = req.body;
		const tasks = board.tasks;
		for (let i = 0; i < tasks.length; i++) {
			const subtaskDocs = await SubtaskModel.insertMany(tasks[i].subtasks);
			tasks[i].subtasks = subtaskDocs.map((subtaskDoc) => subtaskDoc._id);
			const taskDoc = new TaskModel(tasks[i]);
			await taskDoc.save();
			board.tasks[i] = taskDoc._id;
		}
		const boardDoc = new BoardModel(board);
		await boardDoc.save();
		res.send({
			message: "board is added"
		});
	} catch (error) {
		res.send({
			error: error.message
		});
	}
});

boardsRouter.get("/tasks", async (req, res) => {
	try {
		// error
		const tasks = await TaskModel.find();
		res.send(tasks);
	} catch (error) {
		res.send({
			error: error.message
		});
	}
});

boardsRouter.get("/tasks/:taskId", async (req, res) => {
	try {
		const { taskId } = req.params;
		const task = await TaskModel.findOne({ _id: taskId }).populate("subtasks");
		res.send(task);
	} catch (error) {
		res.send({
			error: error.message
		});
	}
});

boardsRouter.patch("/tasks/:taskId", async (req, res) => {
	try {
		const { taskId } = req.params;
		const update = req.body;
		await TaskModel.findOneAndUpdate({ _id: taskId }, update);
		res.send({
			message: "task is updated"
		});
	} catch (error) {
		res.send({
			error: error.message
		});
	}
});

boardsRouter.delete("/tasks/:taskId", async (req, res) => {
	try {
		const { taskId } = req.params;
		await TaskModel.findOneAndDelete({ _id: taskId });
		res.send({
			message: "task is delete"
		});
	} catch (error) {
		res.send({
			error: error.message
		});
	}
});

boardsRouter.get("/tasks/subtasks", async (req, res) => {
	try {
		// error
		const subtasks = await SubtaskModel.find();
		res.send(subtasks);
	} catch (error) {
		res.send({
			error: error.message
		});
	}
});

boardsRouter.get("/tasks/subtasks/:subtaskId", async (req, res) => {
	try {
		const { subtaskId } = req.params;
		const subtask = await SubtaskModel.findOne({ _id: subtaskId });
		res.send(subtask);
	} catch (error) {
		res.send({
			error: error.message
		});
	}
});

boardsRouter.patch("/tasks/subtasks/:subtaskId", async (req, res) => {
	try {
		const { subtaskId } = req.params;
		const update = req.body;
		await SubtaskModel.findOneAndUpdate({ _id: subtaskId }, update);
		res.send({
			message: "subtask is updated"
		});
	} catch (error) {
		res.send({
			error: error.message
		});
	}
});

module.exports = boardsRouter;
