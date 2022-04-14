import Author from "../models/Author.js";
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
				return await ctx.authorLoader.load(args.id);
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
		}
	},
	Author: {
		books: bookField
	},
	Publisher: {
		books: bookField
	}
};

export default resolvers;
