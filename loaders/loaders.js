import DataLoader from "dataloader";
import Book from "../models/Book.js";
import Author from "../models/Author.js";

const loaders = {
	booksLoader: new DataLoader((ids) => {
		return Book.find({_id: {$in: ids}});
	}),
	authorsLoader: new DataLoader((ids) => {
		return Author.find({_id: {$in: ids}});
	})
};

export default loaders;
