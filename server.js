import {ApolloServer} from "apollo-server";
import typeDefs from "./grphql/typeDefs.js";
import resolvers from "./grphql/resolvers.js";
import createDb from "./mongo/createDb.js";

createDb();

const server = new ApolloServer({
	typeDefs,
	resolvers
});

server.listen().then(({url}) => {
	console.log("server listen at " + url);
});
