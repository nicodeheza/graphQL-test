import Book from "../../../models/Book.js";
import Author from "../../../models/Author.js";
import Publisher from "../../../models/Publisher.js";
import {AuthenticationError, UserInputError} from "apollo-server";

export const createNewBookFunc = async (parent, args, ctx) => {
	if (!ctx.user) throw new AuthenticationError("Forbidden");
	try {
		const authors = await Author.find({_id: {$in: args.authorsIds}});
		if (authors.length !== args.authorsIds.length)
			throw new UserInputError("Invalid authors");

		const publisher = await Publisher.findById(args.publisherId);
		if (!publisher) throw new UserInputError("Invalid publisher");

		const newBookData = {
			title: args.title,
			ISBN: args.ISBN,
			authors: args.authorsIds,
			publisher: args.publisherId
		};
		if (args.synopsis) newBookData.synopsis = args.synopsis;
		if (args.genres) newBookData.genres = args.genres;
		if (args.publicationYear) newBookData.publicationYear = args.publicationYear;
		const newBook = new Book(newBookData);
		const book = await newBook.save();

		publisher.books.push(book._id);
		await publisher.save();
		await ctx.publisherLoader.clear(publisher._id.toString());
		await Promise.all(
			authors.map((ele) => {
				ele.books.push(book._id);
				return Promise.all([ele.save(), ctx.authorsLoader.clear(ele._id.toString())]);
			})
		);

		return book;
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
	if (args.title) book.title = args.title;
	if (args.ISBN) book.ISBN = args.ISBN;
	if (args.synopsis) book.synopsis = args.synopsis;
	if (args.genres) book.genres = args.genres;
	if (args.publicationYear) book.publicationYear = args.publicationYear;
	if (args.authorsIds) {
		try {
			const authorsOp = {};
			args.authorsIds.forEach((ele) => {
				authorsOp[ele] = 1;
			});
			book.authors.forEach((ele) => {
				const id = ele.toString();
				if (!authorsOp[id]) {
					authorsOp[id] = -1;
				} else {
					authorsOp[id] = 0;
				}
			});

			const idsToEdit = Object.keys(authorsOp).filter((id) => authorsOp[id] !== 0);

			const authorsArr = await Promise.all(
				idsToEdit.map(async (id) => {
					return Author.findById(id);
				})
			);
			await Promise.all(
				authorsArr.map(async (a) => {
					if (!a) throw new UserInputError("The authors doesn't exist");
					const id = a._id.toString();
					if (authorsOp[id] === 1) {
						a.books.push(book._id);
					} else if (authorsOp[id] === -1) {
						a.books = a.books.filter((id) => id.toString() !== book._id.toString());
					}
					return a.save();
				})
			);

			await Promise.all(idsToEdit.map((id) => ctx.authorsLoader.clear(id)));
		} catch (err) {
			console.log(err);
		}
		book.authors = args.authorsIds;
	}
	if (args.publisherId) {
		try {
			if (args.publisherId !== book.publisher.toString()) {
				const NewPublisher = await Publisher.findById(args.publisherId);
				if (!NewPublisher) throw new UserInputError("The Publisher doesn't exist");
				const oldPublisher = await Publisher.findById(book.publisher);
				NewPublisher.books.push(book._id);
				oldPublisher.books = oldPublisher.books.filter(
					(b) => b.toString() !== book._id.toString()
				);
				await Promise.all([
					NewPublisher.save(),
					oldPublisher.save(),
					ctx.publisherLoader.clear(args.publisherId),
					ctx.publisherLoader.clear(oldPublisher._id.toString())
				]);
			}
		} catch (err) {
			console.log(err);
		}
		book.publisher = args.publisherId;
	}
	try {
		await ctx.booksLoader.clear(book._id.toString());
		return await book.save();
	} catch (err) {
		console.log(err);
	}
};
