import Publisher from "../../../models/Publisher.js";

export const getAllPublishersFunc = async () => {
	try {
		return await Publisher.find({});
	} catch (err) {
		console.log(err);
	}
};

export const getPublisherByIdFunc = async (parent, args, ctx) => {
	try {
		return await ctx.publisherLoader.load(args.id);
	} catch (err) {
		console.log(err);
	}
};
