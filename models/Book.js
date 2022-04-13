import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
	title: {type: String, required: true},
	ISBN: {type: String, required: true},
	synopsis: {type: String, required: true},
	genres: {type: [String], required: true},
	publicationYear: {type: Number, required: true},
	authors: [{type: mongoose.Schema.Types.ObjectId, ref: "Author"}],
	publisher: {type: mongoose.Schema.Types.ObjectId, ref: "Publisher"}
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
