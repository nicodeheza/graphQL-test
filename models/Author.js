import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	country: String,
	books: [{type: mongoose.Schema.Types.ObjectId, ref: "Book"}]
});

const Author = mongoose.model("Author", authorSchema);
export default Author;
