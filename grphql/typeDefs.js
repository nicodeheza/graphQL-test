import {gql} from "apollo-server";

const typeDefs = gql`
	type Query {
		getHello: String
	}
`;

export default typeDefs;
