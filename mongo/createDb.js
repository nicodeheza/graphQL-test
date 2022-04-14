import {MongoMemoryServer} from "mongodb-memory-server-core";
import mongoose from "mongoose";
import faker from "@faker-js/faker";
import Book from "../models/Book.js";
import Publisher from "../models/Publisher.js";
import Author from "../models/Author.js";

export default async function createDb() {
	try {
		const mongoDb = await MongoMemoryServer.create();
		const uri = mongoDb.getUri();
		mongoose.connect(uri);
		console.log(uri);
		const db = mongoose.connection;
		db.on("error", (err) => console.log(err));
		db.on("open", () => console.log("connected to Mongoose"));
		console.log("Creating db records...");
		await populateDb(100);
		console.log("Records created");
		console.log(await Book.find({}).limit(1).exec());
	} catch (err) {
		console.log(err);
	}
}

async function populateDb(numOfBook) {
	try {
		const arrOfAuthors = [];
		let arrOfPublishers = [];
		let arrOfBooks = [];
		for (let i = 0; i < numOfBook / 1.5; i++) {
			const newAuthor = {
				firstName: faker.name.findName(),
				lastName: faker.name.lastName(),
				country: faker.address.country()
			};
			arrOfAuthors.push(newAuthor);
			const newPublisher = {
				name: faker.company.companyName(),
				foundationYear: new Date(faker.date.past()).getFullYear()
			};
			arrOfPublishers.push(newPublisher);
		}
		const authors = await Author.create(arrOfAuthors);
		const publisher = await Publisher.create(arrOfPublishers);

		for (let i = 0; i < numOfBook; i++) {
			const newBook = {
				title: faker.lorem.words(),
				ISBN: faker.phone.phoneNumberFormat(),
				synopsis: faker.lorem.paragraph(),
				genres: faker.random.arrayElements(
					["Mystery", "Historical", "Romance", "Science Fiction", "Realist Literature"],
					Math.floor(Math.random() * 5) + 1
				),
				publicationYear: new Date(faker.date.past(100)).getFullYear(),
				authors: getAuthorsIds(
					authors.map((e) => e._id),
					Math.floor(Math.random() * 3) + 1
				),
				publisher: getPublisherIds(publisher.map((e) => e._id))
			};

			arrOfBooks.push(newBook);
		}
		const books = await Book.create(arrOfBooks);
		books.forEach(async (book) => {
			book.authors.forEach(async (authorId) => {
				const author = await Author.findById(authorId);
				author.books.push(book._id);
				await author.save();
			});
			const publisher = await Publisher.findById(book.publisher);
			publisher.books.push(book.id);
			await publisher.save();
		});
	} catch (err) {
		console.log(err);
	}
}

let authorIndex = 0;
function getAuthorsIds(idsArr, numOfReturns) {
	const arr = [];
	for (let i = 0; i < numOfReturns; i++) {
		arr.push(idsArr[(i + authorIndex) % idsArr.length]);
	}
	authorIndex += numOfReturns;
	return arr;
}
let publisherIndex = 0;
function getPublisherIds(idsArr) {
	const res = idsArr[publisherIndex % idsArr.length];
	publisherIndex++;
	return res;
}
