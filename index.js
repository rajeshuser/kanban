const express = require("express");
const cors = require("cors");
const connection = require("./database");
const usersRouter = require("./routers/usersRouter");
const boardsRouter = require("./routers/boardsRouter");
const authMiddleware = require("./middlewares/authMiddleware");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/users", usersRouter);
app.use("/boards", authMiddleware, boardsRouter);

app.get("/", (req, res) => {
	res.send({
		message: "home"
	});
});

connectThenListen();

async function connectThenListen() {
	try {
		await connection;
		console.log("app is connected to database");
		app.listen(process.env.PORT, () => {
			console.log("app is listening at", `http://localhost:${process.env.PORT}`);
		});
	} catch (error) {
		console.log({ error: error.message });
	}
}
