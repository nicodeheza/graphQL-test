import {ApolloServer} from "apollo-server";
import typeDefs from "./grphql/typeDefs.js";
import resolvers from "./grphql/resolvers.js";
import createDb from "./mongo/createDb.js";
import loaders from "./loaders/loaders.js";
import {verifyAuthJWT} from "./auth/auth.js";

await createDb();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({req}) => {
		const token = req.headers.authorization || "";
		const user = await verifyAuthJWT(token);
		return {
			user,
			booksLoader: loaders.booksLoader,
			authorsLoader: loaders.authorsLoader,
			publisherLoader: loaders.publishersLoader,
			usersLoader: loaders.usersLoader
		};
	}
});

server.listen().then(({url}) => {
	console.log("server listen at " + url);
});
