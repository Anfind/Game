# 🚲 HƯỚNG DẪN NHANH - Game Đàm Phán Xe Đạp

## ⚡ Chạy game trong 3 phút

### Bước 1: Cài đặt (chỉ cần làm 1 lần)

Mở **Command Prompt** (CMD) tại thư mục dự án và chạy:

```bash
cd d:\An\Game
npm run install-all
```

Đợi khoảng 2-3 phút để cài đặt hoàn tất.

### Bước 2: Bật MongoDB

**Cách 1 - MongoDB Local:**
```bash
net start MongoDB
```

**Cách 2 - MongoDB Atlas (Cloud):**
- Nếu dùng MongoDB Atlas, đã setup sẵn trong file `server/.env`
- Không cần làm gì thêm

### Bước 3: Chạy game

```bash
npm run dev
```

Chờ vài giây cho đến khi thấy:
```
✅ MongoDB Connected
🚀 Server running on port 5000
📡 Socket.io ready
```

### Bước 4: Mở trình duyệt

Mở **2 tabs/cửa sổ** trình duyệt:
- **Tab 1 (Player 1):** http://localhost:3000
- **Tab 2 (Player 2):** http://localhost:3000

### Bước 5: Chơi game

**Ở cả 2 tabs:**
1. Click "**Start the Game**"
2. Chọn **cùng một nhóm** (ví dụ: Group 2)
3. Đợi vài giây → Tự động ghép cặp
4. Bắt đầu đàm phán!

**Quy tắc:**
- Person A đề xuất trước: Ví dụ A nhận 500€, B nhận 500€
- Person B chọn phản hồi:
  - ✅ **Accept** = Chấp nhận (game kết thúc - thành công)
  - 👎 **Too Low** = Quá thấp (tiếp tục đàm phán)
  - 💼 **Better Offer** = Có lựa chọn tốt hơn (tiếp tục)
  - ❌ **Not Accept** = Từ chối (game kết thúc - thất bại)

---

## 🎮 Ví dụ chơi

### Scenario 1: Thành công ngay vòng 1
1. **Tab 1 (Person A):** Đề xuất A=500€, B=500€ → Submit
2. **Tab 2 (Person B):** Chọn "**Accept**"
3. ✅ **Kết quả:** A nhận 500€, B nhận 500€

### Scenario 2: Đàm phán nhiều vòng
1. **Round 1:**
   - Person A: A=600€, B=400€
   - Person B: "**Too Low**" (từ chối, tiếp tục)

2. **Round 2:**
   - Person B: A=450€, B=550€
   - Person A: "**Accept**" (chấp nhận)

3. ✅ **Kết quả:** A nhận 450€, B nhận 550€

### Scenario 3: Thất bại
1. **Round 1:**
   - Person A: A=800€, B=200€
   - Person B: "**Not Accept**" (từ chối kết thúc)

2. ❌ **Kết quả:** 
   - Person A nhận 0€
   - Person B nhận theo BATNA của nhóm (ví dụ Group 2 = 300€)

---

## 📊 4 Nhóm chơi - Giải thích

Mỗi nhóm có "**giá trị thay thế**" (BATNA) khác nhau cho Person B:

| Nhóm | Person A | Person B | Giải thích |
|------|----------|----------|------------|
| **1** | 0€ | 0€ | Cả 2 đều không có lựa chọn khác |
| **2** | 0€ | 250€ | B có thể bán riêng được 250€ |
| **3** | 0€ | 500€ | B có thể bán riêng được 500€ |
| **4** | 0€ | 750€ | B có thể bán riêng được 750€ |

**Lưu ý:**
- Nếu đàm phán **thành công** → Chia theo thỏa thuận
- Nếu đàm phán **thất bại** → A nhận 0€, B nhận BATNA

**Chiến lược:**
- Group 1: Dễ thỏa thuận nhất (cả 2 đều phải hợp tác)
- Group 4: Khó nhất (B có lựa chọn tốt, có thể từ chối)

---

## 💾 Export dữ liệu ra Excel

Sau khi game kết thúc:
1. Click nút "**Export Data (Excel)**"
2. File `.xlsx` sẽ tự động download
3. Mở file để xem chi tiết từng vòng đàm phán

File Excel bao gồm:
- Thông tin từng vòng (Round, Proposer, Offers, Response)
- Tóng kết game (Status, Final Payouts, BATNA)
- Timestamp mỗi hành động

---

## 🛑 Dừng game

Trong terminal đang chạy:
- Nhấn `Ctrl + C`
- Chọn `Y` khi hỏi

---

## 🔄 Chơi lại

**Cách 1 - Trong game:**
- Click "**Play Again**" ở màn hình kết quả

**Cách 2 - Chạy lại từ đầu:**
```bash
npm run dev
```

---

## 🐛 Gặp lỗi?

### Lỗi: "Cannot connect to MongoDB"
```bash
# Chạy lệnh này
net start MongoDB
```

### Lỗi: "Port 5000 already in use"
```bash
# Kill process đang dùng port
taskkill /F /IM node.exe

# Chạy lại
npm run dev
```

### Lỗi: "Module not found"
```bash
# Cài lại dependencies
npm run install-all
```

### Game không ghép cặp được
- Đảm bảo **2 players chọn cùng 1 group**
- Refresh cả 2 tabs và thử lại
- Kiểm tra server có đang chạy không

### Socket disconnected
- Refresh browser
- Restart server (`Ctrl + C` → `npm run dev`)
- Clear browser cache

---

## 📱 Chơi trên điện thoại

1. Kiểm tra IP máy tính:
```bash
ipconfig
# Tìm IPv4 Address, ví dụ: 192.168.1.100
```

2. Trên điện thoại, truy cập:
```
http://192.168.1.100:3000
```

3. Đảm bảo cùng mạng WiFi với máy tính

---

## 📚 Tài liệu đầy đủ

- **README_SETUP.md** - Hướng dẫn chi tiết
- **QUICK_START.md** - Quick start (English)
- **INSTALLATION.md** - Installation steps
- **CHEATSHEET.md** - Các lệnh thường dùng
- **PROJECT_SUMMARY.md** - Tổng quan dự án

---

## ✅ Checklist trước khi chơi

- [ ] Đã cài Node.js (v16 trở lên)
- [ ] MongoDB đang chạy
- [ ] Đã chạy `npm run install-all`
- [ ] Server đang chạy (`npm run dev`)
- [ ] Mở được http://localhost:3000

Nếu tất cả OK → **Enjoy the game! 🎉**

---

## 🎯 Tips chơi hay

### Cho Person A (người đề xuất trước):
- Đề xuất công bằng (50-50) để dễ được chấp nhận
- Tính BATNA của B để đưa offer hợp lý
- Đừng quá tham (A=700€+) vì B có thể từ chối

### Cho Person B (người phản hồi):
- So sánh offer với BATNA của mình
- Nếu offer > BATNA → nên Accept
- Nếu offer < BATNA → có thể từ chối (Not Accept)
- Đừng quá khó tính, có thể mất cơ hội

### Chiến lược chung:
- **Hợp tác** tốt hơn **cạnh tranh**
- Offer công bằng dễ thành công
- Giao tiếp rõ ràng (qua offers)
- Biết khi nào nên chấp nhận

---

## 🎨 Tính năng UI đẹp

✨ Các hiệu ứng đặc biệt:
- Gradient backgrounds chuyển màu mượt mà
- Glassmorphism effect (kính mờ)
- Smooth animations khi chuyển trang
- Loading animations đẹp mắt
- Toast notifications thông minh
- Real-time updates không reload

📱 Responsive:
- Chơi được trên điện thoại
- Tự động điều chỉnh layout
- Touch-friendly buttons
- Smooth scrolling

---

## 💡 Thông tin thêm

**Dựa trên thí nghiệm:**
- "Fahrrad-Verhandlungsspiel" (German)
- "Bicycle Negotiation Experiment"
- Nghiên cứu về đàm phán và BATNA

**Khái niệm:**
- **BATNA** = Best Alternative To a Negotiated Agreement
- Nghĩa: Lựa chọn tốt nhất nếu không thỏa thuận được

**Mục đích:**
- Học về đàm phán
- Hiểu về cooperation vs competition
- Thực hành ra quyết định

---

**Chúc bạn chơi vui vẻ! 🚲💰🎉**

---

**Liên hệ:** Nếu gặp vấn đề, xem file INSTALLATION.md hoặc CHEATSHEET.md
