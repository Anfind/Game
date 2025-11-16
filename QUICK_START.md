# 🚀 Quick Start Guide

## ⚡ Hướng dẫn nhanh (3 phút)

### 1. Cài đặt MongoDB (nếu chưa có)

**Windows:**
```bash
# Download từ: https://www.mongodb.com/try/download/community
# Hoặc dùng MongoDB Atlas (cloud - miễn phí)
```

**Kiểm tra MongoDB đang chạy:**
```bash
# Mở Services (Win + R → services.msc)
# Tìm "MongoDB Server" và Start
```

### 2. Cài đặt Dependencies

```bash
# Từ thư mục d:\An\Game
npm run install-all
```

Lệnh này sẽ:
- Cài packages cho root
- Cài packages cho server (Node.js)
- Cài packages cho client (React)

### 3. Chạy ứng dụng

```bash
npm run dev
```

Lệnh này tự động chạy đồng thời:
- **Server** trên http://localhost:5000
- **Client** trên http://localhost:3000

### 4. Mở trình duyệt

1. Mở 2 tab/window:
   - Tab 1: http://localhost:3000 (Player 1)
   - Tab 2: http://localhost:3000 (Player 2)

2. Ở mỗi tab:
   - Click "Start the Game"
   - Chọn cùng một Group (ví dụ: Group 2)
   - Hệ thống sẽ tự động ghép cặp

3. Bắt đầu đàm phán!

---

## 🎮 Test Flow đầy đủ

### Scenario 1: Đàm phán thành công
1. Player A đề nghị: A=400€, B=600€
2. Player B chọn: **Accept**
3. ✅ Kết quả: A nhận 400€, B nhận 600€

### Scenario 2: Đàm phán thất bại (từ chối)
1. Player A đề nghị: A=700€, B=300€
2. Player B chọn: **Not Accept**
3. ❌ Kết quả: A nhận 0€, B nhận BATNA (tùy group)

### Scenario 3: Đàm phán nhiều vòng
1. Player A đề nghị: A=600€, B=400€
2. Player B chọn: **Too Low** (tiếp tục)
3. Player B đề nghị: A=450€, B=550€
4. Player A chọn: **Accept**
5. ✅ Kết quả: A nhận 450€, B nhận 550€

### Scenario 4: Hết 10 vòng
1. Cứ chọn "Too Low" hoặc "Better Offer"
2. Sau 10 vòng tự động kết thúc
3. ❌ Kết quả: A nhận 0€, B nhận BATNA

---

## 📊 Kiểm tra Export Excel

1. Sau khi game kết thúc, click "Export Data (Excel)"
2. File sẽ tự động download: `negotiation_Pair_XXXX_timestamp.xlsx`
3. Mở file để xem chi tiết từng vòng đàm phán

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot connect to MongoDB"
**Solution:**
```bash
# Kiểm tra MongoDB service đang chạy
net start MongoDB

# Hoặc sửa server/.env để dùng MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bicycle-game
```

### Issue 2: "Port 5000 already in use"
**Solution:**
```bash
# Tìm process đang dùng port
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Hoặc đổi port trong server/.env
PORT=5001
```

### Issue 3: "Module not found"
**Solution:**
```bash
# Xóa và cài lại
rmdir /s /q node_modules
rmdir /s /q server\node_modules
rmdir /s /q client\node_modules
npm run install-all
```

### Issue 4: "Socket connection failed"
**Solution:**
- Clear browser cache
- Restart server
- Kiểm tra firewall không block port 5000
- Thử truy cập: http://localhost:5000/api/health

---

## 🎨 Các tính năng UI/UX đã implement

✨ **Animations & Transitions**
- Smooth page transitions với Framer Motion
- Loading states và skeleton screens
- Micro-interactions trên buttons và cards
- Real-time updates không reload trang

🎨 **Visual Design**
- Gradient backgrounds (Blue & Purple theme)
- Glassmorphism effects
- Responsive cards và modals
- Clean typography với contrast tốt

📱 **Responsive Design**
- Mobile-first approach
- Breakpoints cho tablet và desktop
- Touch-friendly buttons
- Adaptive layouts

🔔 **User Feedback**
- Toast notifications cho mọi actions
- Visual indicators cho turn
- Progress bars và counters
- Error messages rõ ràng

---

## 💡 Tips để test tốt hơn

1. **Test trên nhiều devices:**
   - Desktop browser
   - Mobile responsive mode (F12 → Device toolbar)
   - Tablet size

2. **Test network conditions:**
   - Simulate slow connection (DevTools → Network → Slow 3G)
   - Test disconnect scenarios

3. **Test edge cases:**
   - Invalid offers (không bằng 1000)
   - Rapid clicking
   - Browser back button
   - Refresh giữa chừng

4. **Test pairing:**
   - Chỉ 1 player vào (should wait)
   - 2 players khác group (không pair)
   - 2 players cùng group (pair thành công)

---

## 📚 Tài liệu thêm

- **Game Rules:** Xem `readme.md` hoặc `new.txt`
- **Full Setup:** Xem `README_SETUP.md`
- **API Docs:** Xem phần API Endpoints trong README_SETUP.md

---

**Chúc bạn test vui vẻ! 🎉**
