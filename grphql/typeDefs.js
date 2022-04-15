import {gql} from "apollo-server";

const typeDefs = gql`
	type Query {
		getHello: String
		getAllAuthors: [Author]
		getAuthorById(id: ID!): Author
		getAllPublishers: [Publisher]
		getPublisherById(id: ID!): Publisher
		getBookById(id: ID!): Book
		getAllBooks(
			limit: Int
			offset: Int
			title: String
			author: String
			publisher: String
			year: Int
			sortByTitle: Order
			sortByYear: Order
		): [Book]
	}
	type Mutation {
		createNewBook(
			title: String!
			ISBN: String!
			synopsis: String
			genres: [String]
			publicationYear: Int
			authorsIds: [String]!
			publisherId: String!
		): Book
		updateBook(
			_id: ID!
			title: String
			ISBN: String
			synopsis: String
			genres: [String]
			publicationYear: Int
			authorsIds: [String]
			publisherId: String
		): Book
	}
	type Author {
		_id: ID!
		firstName: String!
		lastName: String!
		country: String
		books: [Book]
	}
	type Publisher {
		_id: ID!
		name: String!
		foundationYear: Int
		books: [Book]
	}
	type Book {
		_id: ID!
		title: String!
		ISBN: String!
		synopsis: String
		genres: [String]
		publicationYear: Int
		authors: [Author]
		publisher: Publisher
	}
	enum Order {
		ASC
		DESC
	}
`;

export default typeDefs;
