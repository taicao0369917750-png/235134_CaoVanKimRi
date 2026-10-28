# Sử dụng Node.js phiên bản nhẹ (Alpine)
FROM node:18-alpine

# Khai báo thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json để cài đặt thư viện
COPY package*.json ./

# Cài đặt các thư viện phụ thuộc
RUN npm install --production

# Sao chép toàn bộ mã nguồn của backend vào container
COPY . .

# Khai báo cổng ứng dụng lắng nghe
EXPOSE 5000

# Lệnh khởi chạy ứng dụng
CMD ["node", "server.js"]