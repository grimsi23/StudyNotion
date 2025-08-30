const mongoose = require("mongoose");
require("dotenv").config();

const { MONGODB_URL } = process.env;

exports.connect = () => {
	mongoose
		.connect(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then((`DB Connection Success`))
		.catch((err) => {
			(`DB Connection Failed`);
			(err);
			process.exit(1);
		});
};
