# Bàn tay đếm số (dùng cho các tập toán)

- `../hands.js` — vẽ bàn tay 5 ngón kiểu Mid-century.
  - `drawCountHand(ctx, x, y, scale, ext, { side, ghost, glowSet })`
  - `fingersFor(n)` (0–5, một tay), `handsFor(n)` (0–10, hai tay)
  - `twoHandState(n, { folded, added })` — trạng thái sau khi gập (trừ) hoặc giơ thêm (cộng)
  - Thứ tự giơ: trỏ → giữa → áp út → út → cái (tay 1), rồi tay 2; gập theo thứ tự ngược lại.
- `main.js` + `index.html` — trang sinh bảng 100 trường hợp (55 trừ, 45 cộng).
- `../sheets/ban_tay_tat_ca_truong_hop.pdf` — bảng đã xuất.
