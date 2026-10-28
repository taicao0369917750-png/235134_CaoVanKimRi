const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  publisher: { type: String, required: true },
  publishYear: { type: Number, required: true },
  isbn: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);