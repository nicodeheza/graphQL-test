import Author from "../models/Author.js";
import Book from "../models/Book.js";
import Publisher from "../models/Publisher.js";

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
