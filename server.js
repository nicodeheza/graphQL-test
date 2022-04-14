import {ApolloServer} from "apollo-server";
import typeDefs from "./grphql/typeDefs.js";
import resolvers from "./grphql/resolvers.js";
import createDb from "./mongo/createDb.js";
import loaders from "./loaders/loaders.js";

await createDb();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({req}) => {
		return {
			booksLoader: loaders.booksLoader,
			authorsLoader: loaders.authorsLoader,
			publisherLoader: loaders.publishersLoader
		};
	}
});

server.listen().then(({url}) => {
	console.log("server listen at " + url);
});
