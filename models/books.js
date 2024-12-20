import mongoose from 'mongoose';

const BookSchema = mongoose.Schema({
    title: String,
    author: String,
    isbn: String,
    category: String,
    collection_id: Number, // References PostgreSQL user_collections
    added_at: Date
})

const Books = mongoose.model('Books', BookSchema)

export default Books;