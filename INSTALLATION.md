# 📝 INSTALLATION COMMANDS - Chạy từng bước

## Bước 1: Cài đặt packages

### Mở Command Prompt (CMD) tại thư mục dự án
```bash
cd d:\An\Game
```

### Cài tất cả dependencies một lần
```bash
npm run install-all
```

**Hoặc cài từng phần:**

```bash
# 1. Root dependencies
npm install

# 2. Server dependencies
cd server
npm install
cd ..

# 3. Client dependencies
cd client
npm install
cd ..
```

---

## Bước 2: Setup MongoDB

### Option A: MongoDB Local (Recommended for development)

**Nếu chưa cài MongoDB:**
1. Download: https://www.mongodb.com/try/download/community
2. Cài đặt với default settings
3. MongoDB sẽ tự chạy như Windows Service

**Start MongoDB Service:**
```bash
net start MongoDB
```

**Stop MongoDB Service:**
```bash
net stop MongoDB
```

**Check MongoDB đang chạy:**
```bash
# Mở Services
# Win + R → gõ "services.msc" → Enter
# Tìm "MongoDB Server" → phải ở trạng thái "Running"
```

### Option B: MongoDB Atlas (Cloud - Free)

1. Đăng ký tài khoản: https://www.mongodb.com/cloud/atlas/register
2. Tạo Free Cluster
3. Tạo Database User
4. Get Connection String
5. Sửa file `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/bicycle-game?retryWrites=true&w=majority
NODE_ENV=development
```

---

## Bước 3: Chạy ứng dụng

### Option A: Chạy đồng thời Server + Client (Recommended)

```bash
# Từ thư mục root (d:\An\Game)
npm run dev
```

Kết quả:
- ✅ Server chạy trên: http://localhost:5000
- ✅ Client chạy trên: http://localhost:3000
- ✅ Cả 2 cùng chạy trong 1 terminal

### Option B: Chạy riêng từng phần

**Terminal 1 - Server:**
```bash
cd d:\An\Game\server
npm run dev
```

**Terminal 2 - Client (mở terminal mới):**
```bash
cd d:\An\Game\client
npm run dev
```

---

## Bước 4: Test ứng dụng

### Mở 2 browser tabs

**Tab 1 (Player 1):**
```
http://localhost:3000
```

**Tab 2 (Player 2):**
```
http://localhost:3000
```

### Flow test:

1. **Ở cả 2 tabs:**
   - Click "Start the Game"
   
2. **Chọn cùng một Group (ví dụ: Group 2):**
   - Tab 1: Click "Group 2"
   - Tab 2: Click "Group 2"
   
3. **Hệ thống tự động ghép cặp:**
   - Tab 1 → Person A
   - Tab 2 → Person B
   
4. **Bắt đầu đàm phán:**
   - Person A (Tab 1) đề nghị: A=500€, B=500€
   - Click "Submit Offer"
   - Person B (Tab 2) nhận offer
   - Chọn response: "Accept"
   
5. **Xem kết quả:**
   - Cả 2 tabs tự động chuyển sang màn hình Result
   - Click "Export Data" để tải Excel

---

## 🔍 Verify Installation

### Kiểm tra Server đang chạy:
```bash
# Mở browser hoặc dùng curl
curl http://localhost:5000/api/health
```

Kết quả mong đợi:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Kiểm tra Client đang chạy:
```bash
# Mở browser
http://localhost:3000
```

Nên thấy màn hình "Welcome to the Bicycle Negotiation Game!"

### Kiểm tra MongoDB connection:
Xem terminal của server, nên thấy:
```
✅ MongoDB Connected: localhost
```

---

## 🛑 Stop Application

### Nếu chạy với `npm run dev`:
- Nhấn `Ctrl + C` trong terminal
- Chọn `Y` khi hỏi "Terminate batch job"

### Nếu chạy riêng:
- Stop cả 2 terminals (Server và Client)
- Nhấn `Ctrl + C` ở mỗi terminal

---

## 🔄 Restart Application

```bash
# Từ thư mục root
npm run dev
```

Hoặc nếu cần clean restart:

```bash
# Kill tất cả Node processes
taskkill /F /IM node.exe

# Start lại
npm run dev
```

---

## 📦 Production Build

### Build Client cho production:
```bash
cd client
npm run build
```

Build output sẽ ở: `client/dist/`

### Serve production build:
```bash
cd client
npm run preview
```

---

## 🧹 Clean Installation (nếu có lỗi)

### Xóa tất cả node_modules:
```bash
# Từ root
rmdir /s /q node_modules
rmdir /s /q server\node_modules
rmdir /s /q client\node_modules
```

### Xóa package-lock.json:
```bash
del package-lock.json
del server\package-lock.json
del client\package-lock.json
```

### Cài lại:
```bash
npm run install-all
```

---

## 🎯 Common NPM Scripts

### Root (d:\An\Game)
```bash
npm run dev           # Chạy server + client đồng thời
npm run server        # Chỉ chạy server
npm run client        # Chỉ chạy client
npm run install-all   # Cài tất cả dependencies
```

### Server (d:\An\Game\server)
```bash
npm run dev          # Chạy server với nodemon (auto-reload)
npm start            # Chạy server production
```

### Client (d:\An\Game\client)
```bash
npm run dev          # Chạy dev server với hot reload
npm run build        # Build cho production
npm run preview      # Preview production build
```

---

## ✅ Checklist trước khi chạy

- [ ] Node.js đã cài (v16+)
- [ ] MongoDB đang chạy (local hoặc Atlas)
- [ ] Đã chạy `npm run install-all`
- [ ] File `server/.env` tồn tại và đúng
- [ ] Port 5000 và 3000 chưa bị dùng
- [ ] Không có lỗi khi cài packages

---

**Nếu mọi thứ OK, chạy `npm run dev` và enjoy! 🎉**
