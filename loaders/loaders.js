import DataLoader from "dataloader";
import Book from "../models/Book.js";
import Author from "../models/Author.js";
import Publisher from "../models/Publisher.js";
import User from "../models/User.js";

const loaders = {
	booksLoader: new DataLoader((ids) => {
		return Book.find({_id: {$in: ids}});
	}),
	authorsLoader: new DataLoader((ids) => {
		return Author.find({_id: {$in: ids}});
	}),
	publishersLoader: new DataLoader((ids) => {
		return Publisher.find({_id: {$in: ids}});
	}),
	usersLoader: new DataLoader((userName) => {
		return User.find({userName: {$in: userName}});
	})
};

export default loaders;
