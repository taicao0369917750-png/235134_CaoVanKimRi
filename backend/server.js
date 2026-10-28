const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Book = require('./models/Book');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối cơ sở dữ liệu MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected Successfully!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// --- API ROUTES ---

// 1. Endpoint kiểm tra trạng thái hoạt động của Backend (GET /health)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend running successfully!' });
});

// 2. Lấy danh sách sách VÀ Tìm kiếm sách (GET /api/books?search=...)
app.get('/api/books', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    // Xử lý tìm kiếm theo tên sách, tác giả, thể loại hoặc mã sách
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { bookId: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const books = await Book.find(query);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách sách', error: error.message });
  }
});

// 3. Xem thông tin 1 sách theo ID (GET /api/books/:id)
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách với ID tương ứng' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
});

// 4. Thêm sách mới (POST /api/books) - Kiểm tra dữ liệu & chống trùng bookId
app.post('/api/books', async (req, res) => {
  try {
    const { bookId, title, author, category, publisher, publishYear, isbn, quantity } = req.body;

    // Kiểm tra dữ liệu đầu vào bắt buộc
    if (!bookId || !title || !author || !category || !publisher || !publishYear || !isbn || quantity === undefined) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc' });
    }

    // Kiểm tra trùng mã sách (bookId)
    const existingBook = await Book.findOne({ bookId });
    if (existingBook) {
      return res.status(400).json({ message: `Mã sách '${bookId}' đã tồn tại!` });
    }

    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Mã sách (bookId) đã tồn tại trong hệ thống' });
    }
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
  }
});

// 5. Cập nhật thông tin sách (PUT /api/books/:id)
app.put('/api/books/:id', async (req, res) => {
  try {
    const { title, author, category, publisher, publishYear, isbn, quantity } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!title || !author || !category || !publisher || !publishYear || !isbn || quantity === undefined) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các thông tin khi cập nhật' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Không tìm thấy sách để cập nhật' });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: 'Dữ liệu cập nhật không hợp lệ', error: error.message });
  }
});

// 6. Xóa sách (DELETE /api/books/:id)
app.delete('/api/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Không tìm thấy sách để xóa' });
    }
    res.status(200).json({ message: 'Đã xóa sách thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi xóa sách', error: error.message });
  }
});

// Khởi chạy Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});