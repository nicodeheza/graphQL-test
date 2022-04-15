import mongoose from "mongoose";

const publisherSchema = new mongoose.Schema({
	name: {type: String, required: true},
	foundationYear: Number,
	books: [{type: mongoose.Schema.Types.ObjectId, ref: "Book"}]
});

const Publisher = mongoose.model("Publisher", publisherSchema);
export default Publisher;
