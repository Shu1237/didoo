# Route Structure Documentation

## Overview
Dự án đã được redesign lại với cấu trúc route rõ ràng theo permission boundary, tách biệt logic cho từng role (Admin/Organizer/User).

## Route Groups & URL Paths

**Lưu ý quan trọng:** Route groups `(admin)`, `(organizer)`, `(user)` chỉ dùng để tổ chức layouts, không ảnh hưởng đến URL. Để tránh xung đột, các route phải có prefix role trong folder structure.

### 1. `(user)` - Public/User Routes
Routes dành cho người dùng thông thường và public access.

**Folder Structure:** `src/app/(user)/...`
**URL Paths:**
- `/home` - Trang chủ, khám phá sự kiện
- `/events` - Danh sách sự kiện
- `/events/[id]` - Chi tiết sự kiện
- `/map` - Bản đồ sự kiện
- `/user/tickets` - Vé đã mua
- `/user/profile` - Hồ sơ người dùng

**Layout:** `src/app/(user)/layout.tsx`
- Header với navigation
- Footer
- Public access, không yêu cầu authentication

### 2. `(organizer)` - Organizer Routes
Routes dành cho event organizers.

**Folder Structure:** `src/app/(organizer)/organizer/...`
**URL Paths:**
- `/organizer/dashboard` - Bảng điều khiển organizer
- `/organizer/events` - Quản lý sự kiện
- `/organizer/events/create` - Tạo sự kiện mới
- `/organizer/check-in` - Check-in người tham dự

**Layout:** `src/app/(organizer)/layout.tsx`
- Organizer Header với navigation
- Sidebar navigation
- Yêu cầu role: `organizer` hoặc `admin`

### 3. `(admin)` - Admin Routes
Routes dành cho platform administrators.

**Folder Structure:** `src/app/(admin)/admin/...`
**URL Paths:**
- `/admin/dashboard` - Bảng điều khiển admin
- `/admin/users` - Quản lý người dùng
- `/admin/events` - Phê duyệt sự kiện
- `/admin/revenue` - Quản lý doanh thu

**Layout:** `src/app/(admin)/layout.tsx`
- Admin Header với navigation
- Sidebar navigation
- Yêu cầu role: `admin`

### 4. `(auth)` - Authentication Routes
Routes cho authentication (giữ nguyên).

**Folder Structure:** `src/app/(auth)/...`
**URL Paths:**
- `/login` - Đăng nhập
- `/register` - Đăng ký
- `/forgot-password` - Quên mật khẩu

## Component Structure

### Pattern: Page chỉ fetch data, Components render UI

Mỗi route có thư mục `_components` chứa các components nhỏ, focused:

```
src/app/(user)/home/
  ├── page.tsx          # Fetch data only
  └── _components/      # UI components
      ├── HeroSection.tsx
      ├── SearchFilter.tsx
      ├── ListEvent.tsx
      └── MapEvent.tsx
```

### Layout Components

**User Layout:**
- `src/components/layout/Header.tsx` - Dynamic header với auth state
- `src/components/layout/Footer.tsx` - Footer

**Organizer Layout:**
- `src/components/layout/organizer/Header.tsx` - Organizer header
- `src/components/layout/organizer/Sidebar.tsx` - Navigation sidebar

**Admin Layout:**
- `src/components/layout/admin/Header.tsx` - Admin header
- `src/components/layout/admin/Sidebar.tsx` - Navigation sidebar

## Middleware & Permissions

### Middleware (`middleware.ts`)
- Bảo vệ routes theo role
- Redirect tự động dựa trên user role
- Xử lý authentication state

### Permission Utilities (`src/utils/permissions.ts`)
- `hasRole()` - Kiểm tra role
- `isAdmin()` - Kiểm tra admin
- `isOrganizerOrAdmin()` - Kiểm tra organizer/admin
- `getAllowedRoles()` - Lấy allowed roles cho route

## Type Definitions

### User Types (`src/utils/type.ts`)
```typescript
export type UserRole = "user" | "organizer" | "admin" | "staff";

export type JWTUserType = {
  id: number;
  email: string;
  role: UserRole;
  name?: string;
  iat?: number;
  exp?: number;
};
```

## Key Features

1. **Route Protection:** Middleware tự động bảo vệ routes theo role
2. **Dynamic Navigation:** Header hiển thị menu khác nhau dựa trên role
3. **Component Separation:** Mỗi page chỉ fetch data, components render UI
4. **Type Safety:** Full TypeScript với role-based types
5. **Scalable Structure:** Dễ dàng thêm routes và features mới
6. **No Route Conflicts:** Tất cả routes có unique paths với role prefix

## Route Conflict Resolution

**Vấn đề:** Route groups không ảnh hưởng URL, nên `(admin)/dashboard` và `(organizer)/dashboard` đều resolve thành `/dashboard` → xung đột!

**Giải pháp:** Thêm role prefix vào folder structure:
- `(admin)/admin/dashboard` → `/admin/dashboard` ✓
- `(organizer)/organizer/dashboard` → `/organizer/dashboard` ✓
- `(user)/events` → `/events` ✓

## Migration Notes

- ✅ Old `(default)` folder đã được xóa
- ✅ Old `map` folder ở root đã được xóa
- ✅ Root `/` redirects to `/home`
- ✅ Tất cả routes đã có unique paths

## Next Steps

1. Implement API calls thay thế mock data
2. Add Google Maps integration cho event location
3. Implement QR code scanning cho check-in
4. Add payment integration
5. Add real-time features (notifications, updates)
