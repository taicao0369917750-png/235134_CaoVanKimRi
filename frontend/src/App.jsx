import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Lấy URL Backend từ biến môi trường .env (Yêu cầu 8)
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // State tìm kiếm & xem chi tiết
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null); // Yêu cầu 2: Xem chi tiết

  // State Form Thêm / Cập nhật
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    bookId: '',
    title: '',
    author: '',
    category: '',
    publisher: '',
    publishYear: new Date().getFullYear(),
    isbn: '',
    quantity: 1,
    description: ''
  });

  // 1. Tải danh sách sách hoặc Tìm kiếm từ Backend API (Yêu cầu 1 & 6)
  const fetchBooks = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const url = query 
        ? `${API_BASE_URL}/api/books?search=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/api/books`;
      const res = await axios.get(url);
      setBooks(res.data);
    } catch (err) {
      setError('Không thể kết nối tới server Backend hoặc lỗi lấy dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(searchTerm);
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    fetchBooks('');
  };

  // 2. Xem chi tiết sách theo ID (Yêu cầu 2)
  const handleViewDetail = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/books/${id}`);
      setSelectedBook(res.data);
    } catch (err) {
      alert('Không thể tải chi tiết sách!');
    } finally {
      setLoading(false);
    }
  };

  // 3. Xử lý dữ liệu Form nhập
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Thêm mới / Cập nhật sách (Yêu cầu 3 & 4)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/books/${editingId}`, formData);
        setSuccessMsg('Cập nhật thông tin sách thành công!');
      } else {
        await axios.post(`${API_BASE_URL}/api/books`, formData);
        setSuccessMsg('Thêm sách mới thành công!');
      }
      resetForm();
      fetchBooks(searchTerm);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu!');
    }
  };

  // 5. Chuẩn bị sửa sách
  const handleEdit = (book) => {
    setEditingId(book._id);
    setFormData(book);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 6. Xóa sách (Yêu cầu 5)
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      try {
        setError('');
        await axios.delete(`${API_BASE_URL}/api/books/${id}`);
        setSuccessMsg('Đã xóa sách thành công!');
        if (selectedBook && selectedBook._id === id) setSelectedBook(null);
        fetchBooks(searchTerm);
      } catch (err) {
        setError('Lỗi khi xóa sách!');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      bookId: '',
      title: '',
      author: '',
      category: '',
      publisher: '',
      publishYear: new Date().getFullYear(),
      isbn: '',
      quantity: 1,
      description: ''
    });
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <header style={{ borderBottom: '2px solid #2c3e50', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2 style={{ color: '#2c3e50', margin: 0 }}>HỆ THỐNG QUẢN LÝ SÁCH</h2>
        <p style={{ margin: '5px 0 0 0', color: '#7f8c8d' }}>
          Sinh viên thực hiện: <b>Cao Văn Kim Rí</b> | MSSV: <b>235134</b>
        </p>
      </header>

      {/* Thông báo kết quả thao tác & lỗi (Yêu cầu 7) */}
      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>⚠️ {error}</div>}
      {successMsg && <div style={{ background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>✅ {successMsg}</div>}

      {/* Form Thêm/Sửa sách (Yêu cầu 3 & 4) */}
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e9ecef', marginBottom: '25px' }}>
        <h3 style={{ marginTop: 0, color: '#34495e' }}>{editingId ? '📝 CẬP NHẬT THÔNG TIN SÁCH' : '➕ THÊM SÁCH MỚI'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <input name="bookId" placeholder="Mã sách (VD: B235134-04)" value={formData.bookId} onChange={handleChange} required disabled={!!editingId} style={{ padding: '8px' }} />
          <input name="title" placeholder="Tên sách" value={formData.title} onChange={handleChange} required style={{ padding: '8px' }} />
          <input name="author" placeholder="Tác giả" value={formData.author} onChange={handleChange} required style={{ padding: '8px' }} />
          <input name="category" placeholder="Thể loại" value={formData.category} onChange={handleChange} required style={{ padding: '8px' }} />
          <input name="publisher" placeholder="Nhà xuất bản" value={formData.publisher} onChange={handleChange} required style={{ padding: '8px' }} />
          <input name="publishYear" type="number" placeholder="Năm xuất bản" value={formData.publishYear} onChange={handleChange} required style={{ padding: '8px' }} />
          <input name="isbn" placeholder="Mã ISBN" value={formData.isbn} onChange={handleChange} required style={{ padding: '8px' }} />
          <input name="quantity" type="number" placeholder="Số lượng" value={formData.quantity} onChange={handleChange} required style={{ padding: '8px' }} />
          <textarea name="description" placeholder="Mô tả sách..." value={formData.description} onChange={handleChange} style={{ gridColumn: 'span 2', padding: '8px', rows: 3 }} />
          
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ background: editingId ? '#f39c12' : '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {editingId ? 'Lưu thay đổi' : 'Thêm sách'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ background: '#95a5a6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                Hủy bỏ
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Thanh tìm kiếm (Yêu cầu 6) */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm theo Tên sách, Tác giả, Thể loại hoặc Mã sách..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ background: '#2980b9', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
          🔍 Tìm kiếm
        </button>
        {searchTerm && (
          <button type="button" onClick={handleResetSearch} style={{ background: '#7f8c8d', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>
            Xóa lọc
          </button>
        )}
      </form>

      {/* Popup Xem chi tiết sách (Yêu cầu 2) */}
      {selectedBook && (
        <div style={{ background: '#eef6fb', border: '1px solid #bce8f1', padding: '15px', borderRadius: '6px', marginBottom: '20px', position: 'relative' }}>
          <button onClick={() => setSelectedBook(null)} style={{ position: 'absolute', right: '15px', top: '15px', background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer' }}>❌</button>
          <h4 style={{ margin: '0 0 10px 0', color: '#31708f' }}>📖 CHI TIẾT SÁCH: {selectedBook.title}</h4>
          <p><b>Mã sách:</b> {selectedBook.bookId} | <b>Tác giả:</b> {selectedBook.author} | <b>Thể loại:</b> {selectedBook.category}</p>
          <p><b>NXB:</b> {selectedBook.publisher} ({selectedBook.publishYear}) | <b>ISBN:</b> {selectedBook.isbn} | <b>Số lượng:</b> {selectedBook.quantity}</p>
          <p style={{ marginBottom: 0 }}><b>Mô tả:</b> {selectedBook.description || 'Không có mô tả.'}</p>
        </div>
      )}

      {/* Trạng thái đang tải (Yêu cầu 7) */}
      {loading && <p style={{ textAlign: 'center', fontStyle: 'italic' }}>⏳ Đang tải dữ liệu...</p>}

      {/* Màn hình hiển thị danh sách sách (Yêu cầu 1) */}
      {!loading && (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', borderColor: '#ddd' }}>
          <thead>
            <tr style={{ background: '#2c3e50', color: 'white', textAlign: 'left' }}>
              <th>Mã sách</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Thể loại</th>
              <th>Số lượng</th>
              <th style={{ textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((book) => (
                <tr key={book._id}>
                  <td><code>{book.bookId}</code></td>
                  <td><b>{book.title}</b></td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.quantity}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => handleViewDetail(book._id)} style={{ background: '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', marginRight: '5px', cursor: 'pointer' }}>👁️ Xem</button>
                    <button onClick={() => handleEdit(book)} style={{ background: '#f39c12', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', marginRight: '5px', cursor: 'pointer' }}>✏️ Sửa</button>
                    <button onClick={() => handleDelete(book._id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>🗑️ Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#7f8c8d' }}>Không có cuốn sách nào phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;