const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
require("dotenv").config();

const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
	try {
		const users = await UserModel.find();
		res.send(users);
	} catch (error) {
		res.send({
			error: error.message
		});
	}
});

usersRouter.post("/signup", async (req, res) => {
	try {
		const user = req.body;
		user.password = await bcrypt.hash(user.password, 3);
		const userDoc = new UserModel(user);
		await userDoc.save();
		res.send({
			message: "signup is successful"
		});
	} catch (error) {
		res.send({
			error: error.message
		});
	}
});

usersRouter.post("/signin", async (req, res) => {
	try {
		const user = req.body;
		const userDoc = await UserModel.findOne({ email: user.email });
		if (userDoc) {
			const areSame = await bcrypt.compare(user.password, userDoc.password);
			if (areSame) {
				const payload = { userId: userDoc._id };
				const token = jwt.sign(payload, process.env.SECRET);
				res.send({ token });
			} else {
				res.send({
					error: "wrong password"
				});
			}
		} else {
			res.send({
				error: "user not found"
			});
		}
	} catch (error) {
		res.send({
			error: error.message
		});
	}
});

module.exports = usersRouter;
