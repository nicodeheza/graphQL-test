import Book from "../../../models/Book.js";
import mongoose from "mongoose";

export const getBookByIdFunc = async (parent, args, ctx) => {
	try {
		return await ctx.booksLoader.load(args.id);
	} catch (err) {
		console.log(err);
	}
};

export const getAllBooksFunc = async (parent, args, ctx) => {
	const sortArr = [];
	if (args.sortByTitle !== undefined)
		sortArr.push(["title", args.sortByTitle === "ASC" ? 1 : -1]);
	if (args.sortByYear !== undefined)
		sortArr.push(["publicationYear", args.sortByYear === "ASC" ? 1 : -1]);
	const filter = {};
	if (args.title !== undefined) filter.title = args.title;
	if (args.authorId !== undefined)
		filter.authors = mongoose.Types.ObjectId(args.authorId);
	if (args.publisherId !== undefined) filter.publisher = args.publisherId;
	if (args.year !== undefined) filter.publicationYear = args.year;
	try {
		return await Book.find(filter)
			.sort(sortArr)
			.limit(args.limit)
			.skip(args.limit * args.offset)
			.exec();
	} catch (err) {
		console.log(err);
	}
};
