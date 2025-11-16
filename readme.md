# README: Dự án Game Đàm Phán Xe Đạp (Bicycle Negotiation Game)

Tài liệu này mô tả các thông số kỹ thuật và luồng hoạt động của "Trò chơi đàm phán xe đạp", dựa trên tài liệu yêu cầu gốc (game.docx).

## 1. 🎯 Tổng quan dự án (Project Overview)

* **Mục tiêu:** Mô phỏng một tình huống đàm phán hai bên (A và B).
* **Bối cảnh:** Hai người cùng sở hữu các bộ phận của một chiếc xe đạp. Chỉ khi hợp tác, họ mới có thể bán chiếc xe hoàn chỉnh với giá **1.000 €**.
* **Nhiệm vụ:** Người chơi phải đàm phán để thống nhất cách chia 1.000 €.
* **Kết quả:** Trò chơi kết thúc khi đạt được thỏa thuận, hoặc thất bại nếu không thể thống nhất.

## 2. 📖 Kịch bản & Màn hình Giới thiệu (Scenario & Intro Screen)

Khi bắt đầu, người chơi thấy màn hình chào mừng với nội dung sau:

* Hai người (A và B) mỗi người sở hữu một phần của chiếc xe:
    * **Người A:** Sở hữu bánh xe (trị giá €200).
    * **Người B:** Sở hữu khung xe (trị giá €600).
* Chỉ cùng nhau, họ mới bán được chiếc xe hoàn chỉnh giá **1.000 €**.
* Họ phải quyết định cách chia số tiền này.
* **Quan trọng:** Cả hai đều có một "phương án bán thay thế". Nếu đàm phán thất bại, phương án này sẽ tự động được kích hoạt.
* Màn hình này có một nút duy nhất: `👉 “Bắt đầu trò chơi”`.

## 3. ⚙️ Thiết lập & Phân vai (Setup & Role Assignment)

Sau khi nhấp "Bắt đầu trò chơi":

1.  **Chọn Nhóm:** Người chơi phải chọn 1 trong 4 nhóm chơi (Nhóm 1–4). (Xem chi tiết cơ chế nhóm ở Mục 4).
2.  **Phân vai (Roles):** Hệ thống tự động phân vai người chơi:
    * Một người là **Người A**.
    * Một người là **Người B**.
3.  **Ghép cặp (Pairing):** Hệ thống ngẫu nhiên ghép 2 người chơi thành một cặp đàm phán.
4.  **Định danh (Identifiers):**
    * **Player ID:** Mỗi người chơi nhận một ID riêng (ví dụ: `Player_0123`).
    * **Pair ID:** Mỗi cặp nhận một ID chung (ví dụ: `Pair_01`) để theo dõi phiên đàm phán.

## 4. 📊 Cơ chế cốt lõi: 4 Nhóm (Core Mechanic: The 4 Groups - BATNA)

Đây là cơ chế chính của trò chơi, quy định "Phương án bán thay thế" (hay BATNA - Best Alternative To a Negotiated Agreement) của người chơi.

* Có **bốn nhóm riêng biệt** mà người chơi chọn khi vào game.
* Mỗi nhóm quy định mức "phương án bán thay thế" khác nhau cho **Người B**.
* **Người A** luôn có phương án thay thế là **0 €**.
* **Quan trọng (UI/UX):** Người chơi *không biết* thuật ngữ "BATNA". Họ chỉ thấy một dòng thông báo giá trị thay thế của mình. Ví dụ, Người B sẽ thấy: "Person B has the alternative selling option … €".

Bảng giá trị phương án thay thế (BATNA) theo nhóm:

| Nhóm | Phương án thay thế (A) | Phương án thay thế (B) |
| :--- | :--- | :--- |
| 1 | 0 € | 0 € |
| 2 | 0 € | 300 € |
| 3 | 0 € | 500 € |
| 4 | 0 € | 600 € |

## 5. 🔄 Luồng đàm phán (Negotiation Flow)

Trò chơi diễn ra theo lượt (turn-based) giữa A và B.

* **Thời lượng:** Tối đa **10 vòng** đàm phán.
* **Tự động thất bại:** Nếu hết 10 vòng mà không thống nhất, trò chơi tự động kết thúc với kết quả "Thất bại".

### Cấu trúc một vòng (Single Round Structure)

1.  **Bước 1: Đề nghị (Offer)**
    * Người chơi đang giữ lượt (ví dụ: A) nhập đề nghị chia tiền.
    * Ví dụ: "A: 400 €, B: 600 €".
2.  **Bước 2: Phản hồi (Response)**
    * Người còn lại (ví dụ: B) phải chọn 1 trong 4 phản hồi.
3.  **Bước 3: Kết quả vòng (Round Result)**
    * Nếu chọn `Chấp nhận` hoặc `Không chấp nhận` → Trò chơi kết thúc.
    * Nếu chọn `Quá thấp` hoặc `Có đề nghị tốt hơn` → Đổi lượt chơi, vòng mới bắt đầu.

### Các lựa chọn phản hồi (Response Options)

| Tùy chọn (Tiếng Việt) | Tùy chọn (Tiếng Anh - Gốc) | Hành động |
| :--- | :--- | :--- |
| `☐ Quá thấp` | `Too low` | "That is too low for me, counteroffer." (Đổi lượt) |
| `☐ Có đề nghị tốt hơn` | `Better offer` | "I have a better offer outside the negotiation." (Đổi lượt) |
| `☐ Chấp nhận` | `Accept` | "The offer is accepted, end of game." (Thành công) |
| `☐ Không chấp nhận` | `Not accept` | "Negotiation is terminated, end of game." (Thất bại) |

## 6. 🏁 Kết thúc trò chơi & Hiển thị kết quả (Game End & Results)

Trò chơi có 2 trạng thái kết thúc:

### Trường hợp 1: Đàm phán THÀNH CÔNG

* **Trigger:** Một bên chọn "Chấp nhận" (Accept).
* **Màn hình hiển thị:**
    > Negotiation successful!
    > Final distribution:
    > Person A: \_\_\_ €
    > Person B: \_\_\_ €

### Trường hợp 2: Đàm phán THẤT BẠI

* **Trigger:** Một bên chọn "Không chấp nhận" (Not accept) HOẶC hết 10 vòng đàm phán.
* **Màn hình hiển thị:**
    > Negotiation failed.
    > No agreement reached.
* **Kết quả chi trả (Payout):**
    * Người A: Nhận **0 €**.
    * Người B: Nhận mức **tối thiểu (BATNA)** của họ, tùy theo nhóm đã chọn ở đầu game (0 €, 300 €, 500 €, hoặc 600 €).

## 7. 💾 Yêu cầu về Dữ liệu (Data Requirements)

* **Logging:** Mọi hành động (đề nghị, phản hồi) đều phải được ghi lại trong vòng (round) tương ứng.
* **Export:** Khi trò chơi kết thúc (cả thành công và thất bại), hệ thống phải **tự động xuất toàn bộ dữ liệu** ra file Excel (.xlsx).
* **Định dạng file Excel:** Mỗi hàng (row) tương ứng với một lượt (round) của trò chơi."# Game" 
