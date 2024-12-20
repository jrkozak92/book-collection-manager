const BookSchema = {
    title: String,
    author: String,
    isbn: String,
    category: String,
    collection_id: Number, // References PostgreSQL user_collections
    added_at: Date // default value of now timestamp if possible
}