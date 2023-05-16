const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
	name: String,
	tasks: [{ type: mongoose.Types.ObjectId, ref: "task" }]
});

const BoardModel = mongoose.model("board", boardSchema);

module.exports = BoardModel;
