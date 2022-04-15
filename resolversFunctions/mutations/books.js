import Book from "../../models/Book.js";
import {AuthenticationError, UserInputError} from "apollo-server";

export const createNewBookFunc = async (parent, args, ctx) => {
	if (!ctx.user) throw new AuthenticationError("Forbidden");
	//Validate authors and publishers
	try {
		const authors = await ctx.authorsLoader.loadMany(args.authorsIds);
		if (authors[0].reason) throw new UserInputError("The authors doesn't exist");
		await ctx.publisherLoader.load(args.publisherId);
	} catch (err) {
		throw new UserInputError("Invalid authors or publisher");
	}
	const newBookData = {
		title: args.title,
		ISBN: args.ISBN,
		authors: args.authorsIds,
		publisher: args.publisherId
	};
	if (args.synopsis) newBookData.synopsis = args.synopsis;
	if (args.genres) newBookData.genres = args.genres;
	if (args.publicationYear) newBookData.publicationYear = publicationYear;
	const newBook = new Book(newBookData);
	try {
		return await newBook.save();
	} catch (err) {
		console.log(err);
	}
};

export const updateBookFunc = async (parent, args, ctx) => {
	if (!ctx.user) throw new AuthenticationError("Forbidden");
	const book = await Book.findById(args._id);
	if (!book) {
		throw new UserInputError("The book you are trying to update doesn't exist");
	}
	if (args.authorsIds) {
		try {
			const authors = await ctx.authorsLoader.loadMany(args.authorsIds);
			if (authors[0].reason) throw new UserInputError("The authors doesn't exist");
		} catch (err) {
			throw new UserInputError("The authors doesn't exist");
		}
	}
	if (args.publisherId) {
		try {
			await ctx.publisherLoader.load(args.publisherId);
		} catch (err) {
			throw new UserInputError("The Publisher doesn't exist");
		}
	}
	if (args.title) book.title = args.title;
	if (args.ISBN) book.ISBN = args.ISBN;
	if (args.synopsis) book.synopsis = args.synopsis;
	if (args.genres) book.genres = args.genres;
	if (args.publicationYear) book.publicationYear = args.publicationYear;
	if (args.authorsIds) {
		try {
			await Promise.all(book.authors.map((id) => ctx.authorsLoader.clear(id)));
		} catch (err) {
			console.log(err);
		}
		book.authors = args.authorsIds;
	}
	if (args.publisherId) {
		try {
			await ctx.publisherLoader.clear(book.publisher);
		} catch (err) {
			console.log(err);
		}
		book.publisher = args.publisherId;
	}
	try {
		await ctx.booksLoader.clear(book._id);
		return await book.save();
	} catch (err) {
		console.log(err);
	}
};
