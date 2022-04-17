import DataLoader from "dataloader";
import Book from "../models/Book.js";
import Author from "../models/Author.js";
import Publisher from "../models/Publisher.js";
import User from "../models/User.js";

const loaders = {
	booksLoader: new DataLoader(async (ids) => {
		const books = await Book.find({_id: {$in: ids}});
		return ids.map((id) => books.find((book) => book._id.toString() === id));
	}),
	authorsLoader: new DataLoader(async (ids) => {
		const authors = await Author.find({_id: {$in: ids}});
		return ids.map((id) => authors.find((author) => author._id.toString() === id));
	}),
	publishersLoader: new DataLoader(async (ids) => {
		const publishers = await Publisher.find({_id: {$in: ids}});
		return ids.map((id) =>
			publishers.find((publisher) => publisher._id.toString() === id)
		);
	}),
	usersLoader: new DataLoader(async (userNames) => {
		const users = await User.find({userName: {$in: userNames}});
		return userNames.map((userName) => users.find((user) => user.userName === userName));
	})
};

export default loaders;
