import DataLoader from "dataloader";
import Book from "../models/Book.js";
import Author from "../models/Author.js";
import Publisher from "../models/Publisher.js";

const loaders = {
	booksLoader: new DataLoader((ids) => {
		return Book.find({_id: {$in: ids}});
	}),
	authorsLoader: new DataLoader((ids) => {
		console.log(ids);
		return Author.find({_id: {$in: ids}});
	}),
	publishersLoader: new DataLoader((ids) => {
		return Publisher.find({_id: {$in: ids}});
	})
};

export default loaders;
