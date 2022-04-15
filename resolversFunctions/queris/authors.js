import {AuthenticationError} from "apollo-server";
import Author from "../../models/Author.js";

export const getAllAuthorsFunc = async (parent, args, ctx) => {
	if (!ctx.user) throw new AuthenticationError("Forbidden");
	try {
		return await Author.find({});
	} catch (err) {
		console.log(err);
	}
};

export async function getAuthorByIdFunc(parent, args, ctx) {
	if (!ctx.user) throw new AuthenticationError("Forbidden");
	try {
		return await ctx.authorsLoader.load(args.id);
	} catch (err) {
		console.log(err);
	}
}
