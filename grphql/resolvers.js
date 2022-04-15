import {
	getAllAuthorsFunc,
	getAuthorByIdFunc
} from "./resolversFunctions/queris/authors.js";
import {
	getAllPublishersFunc,
	getPublisherByIdFunc
} from "./resolversFunctions/queris/publishers.js";
import {getAllBooksFunc, getBookByIdFunc} from "./resolversFunctions/queris/books.js";
import {createNewBookFunc, updateBookFunc} from "./resolversFunctions/mutations/books.js";
import {logInFunc, signUpFunc} from "./resolversFunctions/mutations/auth.js";

async function bookField(parent, _, ctx) {
	return await ctx.booksLoader.loadMany(parent.books.map((o) => o.toString()));
}

const resolvers = {
	Query: {
		getAllAuthors: getAllAuthorsFunc,
		getAuthorById: getAuthorByIdFunc,
		getAllPublishers: getAllPublishersFunc,
		getPublisherById: getPublisherByIdFunc,
		getBookById: getBookByIdFunc,
		getAllBooks: getAllBooksFunc
	},
	Mutation: {
		createNewBook: createNewBookFunc,
		updateBook: updateBookFunc,
		signUp: signUpFunc,
		logIn: logInFunc
	},
	Author: {
		books: bookField
	},
	Publisher: {
		books: bookField
	},
	Book: {
		authors: async (parent, args, ctx) => {
			if (!ctx.user) return null;
			return await ctx.authorsLoader.loadMany(parent.authors.map((o) => o.toString()));
		},
		publisher: async (parent, args, ctx) => {
			return await ctx.publisherLoader.load(parent.publisher.toString());
		}
	}
};

export default resolvers;
