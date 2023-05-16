const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
require("dotenv").config();

async function authMiddleware(req, res, next) {
	try {
		const token = req.get("authorization");
		const payload = jwt.verify(token, process.env.SECRET);
		const { userId } = payload;
		const userDoc = await UserModel.findOne({ _id: userId });
		if (userDoc) {
			next();
		} else {
			res.send({
				message: "user not found"
			});
		}
	} catch (error) {
		res.send({ error: error.message });
	}
}

module.exports = authMiddleware;
