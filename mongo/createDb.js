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
	} catch (err) {
		console.log(err);
	}
}

async function populateDb(numOfBook) {
	try {
		const arrOfAuthors = [];
		let arrOfPublishers = [];
		let arrOfBooks = [];
		for (let i = 0; i < numOfBook / 2; i++) {
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
				authors: getRandomIds(
					authors.map((e) => e._id),
					Math.floor(Math.random() * 4) + 1
				),
				publisher: getRandomIds(
					publisher.map((e) => e._id),
					1
				)
			};

			arrOfBooks.push(newBook);
		}
		const books = await Book.create(arrOfBooks);
		books.forEach(async (e) => {
			e.authors.forEach(async (id) => {
				await Author.findByIdAndUpdate(id, {books: [...books, e._id]});
			});
			await Publisher.findByIdAndUpdate(e.publisher, {books: [...books, e._id]});
		});
	} catch (err) {
		console.log(err);
	}
}

function getRandomIds(idsArr, numOfReturns) {
	try {
		if (numOfReturns === 1) {
			return idsArr[Math.floor(Math.random() * (idsArr.length - 1))];
		}
		const arr = [];
		for (let i = 0; i < numOfReturns; i++) {
			const r = idsArr[Math.floor(Math.random() * (idsArr.length - 1))];
			if (arr.find((e) => e === r)) {
				i--;
			} else {
				arr.push(r);
			}
		}
		return arr;
	} catch (err) {
		console.log(err);
	}
}
