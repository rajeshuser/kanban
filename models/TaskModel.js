const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
	title: String,
	description: String,
	status: { type: String, enum: ["Todo", "Doing", "Done"], default: "Todo" },
	subtasks: [{ type: mongoose.Types.ObjectId, ref: "subtask" }]
});

const TaskModel = mongoose.model("task", taskSchema);

module.exports = TaskModel;
