import {MongoMemoryServer} from "mongodb-memory-server-core";
import mongoose from "mongoose";
import Book from "../models/Book.js";
import Publisher from "../models/Publisher.js";
import Author from "../models/Author.js";

export default async function createDb() {
	try {
		const mongoDb = await MongoMemoryServer.create();
		const uri = mongoDb.getUri();
		mongoose.connect(uri);
		const db = mongoose.connection;
		db.on("error", (err) => console.log(err));
		db.on("open", () => console.log("connected to Mongoose"));
	} catch (err) {
		console.log(err);
	}
}
