import Author from "../models/Author.js";
import Book from "../models/Book.js";
import Publisher from "../models/Publisher.js";
import {UserInputError} from "apollo-server";

async function bookField(parent, _, ctx) {
	return await ctx.booksLoader.loadMany(parent.books.map((o) => o.toString()));
}

const resolvers = {
	Query: {
		getHello: () => "Hello GraphQL",
		getAllAuthors: async () => {
			try {
				return await Author.find({});
			} catch (err) {
				console.log(err);
			}
		},
		getAuthorById: async (parent, args, ctx) => {
			try {
				return await ctx.authorsLoader.load(args.id);
			} catch (err) {
				console.log(err);
			}
		},
		getAllPublishers: async () => {
			try {
				return await Publisher.find({});
			} catch (err) {
				console.log(err);
			}
		},
		getPublisherById: async (parent, args, ctx) => {
			try {
				return await ctx.publisherLoader.load(args.id);
			} catch (err) {
				console.log(err);
			}
		},
		getBookById: async (parent, args, ctx) => {
			try {
				return await ctx.booksLoader.load(args.id);
			} catch (err) {
				console.log(err);
			}
		},
		getAllBooks: async (parent, args, ctx) => {
			const sortArr = [];
			if (args.sortByTitle !== undefined)
				sortArr.push(["title", args.sortByTitle === "ASC" ? 1 : -1]);
			if (args.sortByYear !== undefined)
				sortArr.push(["publicationYear", args.sortByYear === "ASC" ? 1 : -1]);
			const filter = {};
			if (args.title !== undefined) filter.title = args.title;
			if (args.author !== undefined) filter.authors = args.author;
			if (args.publisher !== undefined) filter.publisher = args.publisher;
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
		}
	},
	Mutation: {
		createNewBook: async (parent, args, ctx) => {
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
		},
		updateBook: async (parent, args, ctx) => {
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
		}
	},
	Author: {
		books: bookField
	},
	Publisher: {
		books: bookField
	},
	Book: {
		authors: async (parent, args, ctx) => {
			return await ctx.authorsLoader.loadMany(parent.authors.map((o) => o.toString()));
		},
		publisher: async (parent, args, ctx) => {
			return await ctx.publisherLoader.load(parent.publisher.toString());
		}
	}
};

export default resolvers;
