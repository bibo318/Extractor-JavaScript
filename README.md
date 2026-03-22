# Extractor-JavaScript

Trích xuất (extract) các API endpoint từ file JavaScript của bất kỳ ứng dụng web nào, chạy trực tiếp trên trình duyệt dưới dạng **bookmarklet**.

---

## 🚀 Cách sử dụng

### Bước 1 – Lấy đoạn code bookmarklet

Mở link sau và **copy toàn bộ nội dung**:

```
https://raw.githubusercontent.com/bibo318/Extractor-JavaScript/main/bookmarklet.js
```

> Hoặc copy trực tiếp nội dung file [`bookmarklet.js`](./bookmarklet.js) trong repo này.

---

### Bước 2 – Tạo Bookmark trên trình duyệt

1. Nhấn **Ctrl + D** (hoặc ⌘ + D trên macOS) để mở hộp thoại tạo bookmark.
2. Đặt tên bookmark là **`Endpoint Extractor`**.
3. Ở trường **URL**, xoá đường dẫn hiện tại và **dán đoạn code vừa copy** vào (đoạn code bắt đầu bằng `javascript:`).
4. Lưu bookmark.

> **Chrome / Edge:** Vào `Bookmarks > Bookmark Manager`, tạo bookmark mới và dán code vào trường URL.  
> **Firefox:** Tạo bookmark, chỉnh sửa và dán code vào trường Location.

---

### Bước 3 – Sử dụng

1. Truy cập vào **ứng dụng web mục tiêu** (target app) trên trình duyệt.
2. **Click vào bookmark** `Endpoint Extractor` vừa tạo.
3. Một **cửa sổ mới** sẽ hiện ra, chứa danh sách các **API endpoint** đã được trích xuất từ trang đó.

---

## 📋 Những gì được trích xuất

Bookmarklet tự động phân tích:

- Tất cả **inline `<script>`** trên trang.
- Tất cả **file JavaScript bên ngoài** được tải bởi trang (cùng origin hoặc CORS cho phép).

Các pattern được nhận diện:

| Pattern | Ví dụ |
|---|---|
| `fetch(url)` | `fetch('/api/users')` |
| `axios.get/post/...` | `axios.post('/v1/login', data)` |
| `$.ajax / $.get / $.post` | `$.get('/api/search')` |
| `url: "..."` trong object | `{ url: '/rest/items' }` |
| `XMLHttpRequest.open(method, url)` | `.open('GET', '/api/data')` |
| Đường dẫn bắt đầu bằng `/api/`, `/v1/`, `/v2/`, `/auth/`, ... | `/api/v2/products` |

---

## 🛠️ Cấu trúc file

| File | Mô tả |
|---|---|
| [`extractor.js`](./extractor.js) | Source code đầy đủ, có comment, dễ đọc |
| [`bookmarklet.js`](./bookmarklet.js) | Code đã được minify và encode, sẵn sàng dùng làm bookmarklet |

---

## ⚠️ Lưu ý

- Bookmarklet chỉ có thể fetch các script **cùng origin** hoặc có CORS header cho phép. Script từ domain khác sẽ bị bỏ qua (không gây lỗi).
- Nếu trình duyệt **chặn popup**, hãy cho phép popup cho trang đó và thử lại.
- Đây là công cụ dành cho mục đích **nghiên cứu / kiểm thử bảo mật hợp pháp**. Vui lòng chỉ sử dụng trên các ứng dụng mà bạn có quyền kiểm tra.

