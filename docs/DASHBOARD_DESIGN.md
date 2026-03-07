# Dashboard Design Specification — Organizer & Admin

> Thiết kế 2 trang dashboard dùng chung layout cho role **Organizer** và **Admin**, dựa trên BE API và base FE (apiRequest, hooks, types). Sử dụng **shadcn-ui** components.

---

## 1. Kiến trúc tổng quan

### 1.1 Cấu trúc route

```
/dashboard                    → Layout chung (role-based)
├── /organizer                → Organizer routes
│   ├── /dashboard            → Tổng quan
│   ├── /events               → Danh sách sự kiện
│   │   ├── /create           → Tạo sự kiện
│   │   └── /[id]             → Chi tiết sự kiện (nested)
│   │       ├── /edit         → Chỉnh sửa
│   │       └── /orders       → Đơn hàng theo sự kiện
│   ├── /orders               → Đơn hàng (tất cả)
│   │   └── /[id]             → Chi tiết đơn (nested)
│   ├── /earnings             → Ví & Doanh thu
│   └── /profile              → Hồ sơ
│
└── /admin                    → Admin routes
    ├── /dashboard            → Tổng quan
    ├── /users                → Quản lý người dùng
    │   └── /[id]             → Chi tiết user (nested)
    ├── /organizers           → Quản lý organizer
    │   └── /[id]             → Chi tiết organizer (nested)
    ├── /events                → Quản lý sự kiện
    │   └── /[id]             → Chi tiết sự kiện (nested)
    ├── /categories           → Quản lý danh mục
    │   └── /[id]             → Chi tiết category (nested)
    ├── /revenue              → Doanh thu hệ thống
    └── /profile              → Hồ sơ admin
```

### 1.2 Layout chung (Shared Layout)

**File:** `src/app/(dashboard)/layout.tsx`

- **Sidebar** (collapsible): Logo, nav items theo role, user profile bottom
- **Header**: Breadcrumb, search (optional), notifications, user dropdown
- **Main**: `overflow-y-auto`, padding `p-6 lg:p-8`, background `bg-zinc-50/70`

**Component structure:**
```
<DashboardLayout>
  <DashboardSidebar role={role} />
  <div className="flex-1 flex flex-col min-h-0">
    <DashboardHeader role={role} />
    <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-zinc-50/70">
      {children}
    </main>
  </div>
</DashboardLayout>
```

---

## 2. Page Architecture: Server Components + Suspense

### 2.1 Nguyên tắc

- **Page** (`page.tsx`): **Server Component** — đọc `searchParams` từ URL, truyền params xuống client sections.
- **Sections** (Table, Chart, Stats): Bọc trong **Suspense** với **fallback** loading — khi filter/params thay đổi → refetch → hiển thị fallback trong lúc load.
- **Filter**: Client component nhận `params` (hoặc `searchParams`) qua props, cập nhật URL → page re-render với params mới.

### 2.2 Cấu trúc page mẫu

```tsx
// app/(dashboard)/admin/users/page.tsx (Server Component)
import { Suspense } from "react";
import { UsersTable } from "./_components/UsersTable";
import { UsersFilters } from "./_components/UsersFilters";
import { SectionFallback } from "@/components/base/SectionFallback";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <UsersFilters defaultParams={params} />

      <Suspense key={JSON.stringify(params)} fallback={<SectionFallback type="table" />}>
        <UsersTable params={params} />
      </Suspense>
    </div>
  );
}
```

### 2.3 Suspense & Fallback

- **`key={JSON.stringify(params)}`**: Khi params thay đổi, React unmount/remount Suspense boundary → trigger fetch mới, hiển thị fallback.
- **SectionFallback**: Component hiển thị Skeleton (table rows, card placeholders, chart placeholder) tương ứng `type`: `"table"` | `"cards"` | `"chart"` | `"list"`.

---

## 3. Theme & Design System

### 3.1 Theme

| Token | Value | Usage |
|-------|-------|-------|
| **Primary** | `zinc-900` / `#18181b` | Sidebar active, buttons primary |
| **Secondary** | `zinc-100` | Background cards, hover |
| **Accent** | `emerald-500` | Success, CTA, positive metrics |
| **Muted** | `zinc-500` | Secondary text, borders |
| **Border** | `zinc-200` | Card borders, dividers |
| **Background** | `zinc-50/70` | Main content area |
| **Card** | `white` + `border-zinc-200` | Cards, modals |

### 3.2 Typography

- **Font**: Inter (body), Plus Jakarta Sans (headings) — đã có trong project
- **Heading 1**: `text-2xl lg:text-3xl font-semibold tracking-tight text-zinc-900`
- **Heading 2**: `text-lg font-semibold text-zinc-900`
- **Body**: `text-sm text-zinc-600`
- **Caption**: `text-xs text-zinc-500`

### 3.3 Spacing & Radius

- **Card radius**: `rounded-2xl` hoặc `rounded-3xl`
- **Button radius**: `rounded-xl`
- **Input radius**: `rounded-lg`
- **Gap sections**: `gap-4 lg:gap-6`

---

## 4. shadcn-ui Components sử dụng

| Component | Usage |
|-----------|--------|
| **Table** | Danh sách CRUD (users, organizers, events, categories, bookings) |
| **Card** | Dashboard stats, content blocks |
| **Button** | Actions, submit, link-style |
| **Input** | Form fields, search |
| **Select** | Dropdown filter, form (status, role, category) |
| **Dialog** | Create/Edit modal, Confirm delete |
| **DropdownMenu** | Row actions (Edit, Delete, Restore) |
| **Badge** | Status (Draft, Published, Paid, Pending) |
| **Avatar** | User/organizer avatar |
| **Tabs** | Tab content (e.g. Event detail: Info / Orders / Reviews) |
| **Pagination** | BasePagination (đã có) |
| **Skeleton** | Loading state |
| **Toast (Sonner)** | Success/error feedback |
| **Form** | react-hook-form + zod (đã có) |
| **Calendar** | Date picker (event start/end) |
| **Popover** | Filter popover, date range |
| **Separator** | Divider |
| **Sheet** | Mobile sidebar (optional) |

---

## 5. Base Components (`src/components/base`)

### 5.1 BaseFilter — Filter theo params (props)

**Props:** Nhận `params` (hoặc `searchParams`) qua props, cập nhật URL khi thay đổi.

```tsx
// BaseFilterProps — mở rộng từ BaseFilter hiện có
interface BaseFilterProps<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Cấu hình từng filter field */
  filters: FilterConfig[];
  /** Params hiện tại (từ searchParams) — dùng làm defaultValues */
  params: T;
  /** Base path cho router.push (default: pathname) */
  basePath?: string;
  /** Callback khi params thay đổi (optional, cho server refetch) */
  onParamsChange?: (params: T) => void;
}
```

**FilterConfig** (đã có): `key`, `label`, `type` (text | select | date | number), `options`, `defaultValue`, `className`.

**Hành vi:** Khi user thay đổi filter → `router.push(pathname + '?' + newSearchParams)` → Page (Server Component) nhận `searchParams` mới → re-render → Section trong Suspense nhận params mới → fetch → fallback → data.

### 5.2 BaseFilterHeader

- Kết hợp: Page title + BaseFilter (inline hoặc collapsible) + Action button (Thêm mới, Export).
- Props: `title`, `filterConfig`, `params`, `actions?: ReactNode`.

### 5.3 BasePagination (đã có)

- Props: `currentPage`, `totalPages`, `totalItems`, `itemsPerPage`, `onPageChange`, `onPageSizeChange`.
- Tích hợp với URL: `pageNumber`, `pageSize` trong searchParams.

### 5.4 SectionFallback

- Props: `type?: "table" | "cards" | "chart" | "list"`.
- Hiển thị Skeleton tương ứng: table = 5–10 rows, cards = 4–6 card placeholders, chart = bar/line placeholder, list = list items.

### 5.5 DataTable (đề xuất)

- Props: `columns`, `data`, `params`, `pagination`, `rowActions`, `loading`.
- Khi `loading` → render Skeleton rows.

### 5.6 FilterConfig mẫu — truyền vào BaseFilter

**Users:**
```tsx
const userFilters: FilterConfig[] = [
  { key: 'fullName', label: 'Họ tên', type: 'text', placeholder: 'Tìm theo tên' },
  { key: 'email', label: 'Email', type: 'text', placeholder: 'Tìm theo email' },
  { key: 'phone', label: 'SĐT', type: 'text', placeholder: 'Tìm theo SĐT' },
  { key: 'roleId', label: 'Vai trò', type: 'select', options: rolesFromApi },
  { key: 'status', label: 'Trạng thái', type: 'select', options: [{ label: 'Active', value: 1 }, ...] },
  { key: 'isDescending', label: 'Sắp xếp', type: 'select', options: [{ label: 'Mới nhất', value: 'true' }, { label: 'Cũ nhất', value: 'false' }], defaultValue: 'true' },
  { key: 'pageNumber', label: 'Trang', type: 'number', defaultValue: 1 },
  { key: 'pageSize', label: 'Số dòng', type: 'select', options: [10, 20, 50], defaultValue: 10 },
];
```

**Organizers:** `name`, `slug`, `status`, `isDescending`, `isDeleted`, `pageNumber`, `pageSize`  
**Events:** `name`, `categoryId`, `organizerId`, `status`, `startTime`, `endTime`, `isDescending`, `isDeleted`, `pageNumber`, `pageSize`  
**Categories:** `name`, `status`, `isDescending`, `isDeleted`, `pageNumber`, `pageSize`  
**Bookings (Revenue/Orders):** `status`, `eventId`, `userId`, `isDescending`, `pageNumber`, `pageSize`

---

## 6. Admin Sections

### 6.1 Dashboard (`/admin/dashboard`)

**API:** Aggregation từ `users`, `organizers`, `events`, `bookings`, `categories`

| Section | Component | API / Data |
|---------|-----------|------------|
| Header | Card | `totalBookings`, `updatedAt` |
| Stats Grid | 4–6 Card | `totalUsers`, `totalOrganizers`, `pendingOrganizers`, `totalEvents`, `activeEvents`, `totalCategories`, `paidBookings`, `totalRevenue`, `averageOrderValue` |
| Revenue Chart | Chart (Recharts) | `bookings` (paid) grouped by date |
| Booking Funnel | Card + Progress | `paid`, `pending`, `cancelled` ratio |
| Event Health | Card + Progress bars | Event status counts (Opened, Published, Draft, Closed, Cancelled) |
| Recent Transactions | Table | `bookings` slice(0, 8) |
| Recent Events | Table | `events` slice(0, 8) |
| Operational Notes | Card | Derived metrics |

**shadcn:** Card, Table, Badge, Progress (custom hoặc Tailwind)

**Filters (Dashboard):**

| Filter | Component | Query param | Mô tả |
|--------|-----------|-------------|-------|
| Khoảng thời gian | Popover + Calendar (date range) | `startDate`, `endDate` (local state) | Lọc chart Revenue, Transactions theo ngày |
| Refresh | Button | - | Làm mới dữ liệu |

**Fetch Data Default (Admin Dashboard):**

| API / Data | Default params | Fields cần thiết |
|------------|----------------|-------------------|
| `GET /users` (count) | `pageNumber: 1`, `pageSize: 1` | - |
| `GET /organizers` (count) | `pageNumber: 1`, `pageSize: 1` | - |
| `GET /organizers` (pending) | `pageNumber: 1`, `pageSize: 1`, `status: 1` | - |
| `GET /events` (count) | `pageNumber: 1`, `pageSize: 1` | - |
| `GET /events` (by status) | `pageNumber: 1`, `pageSize: 1`, `status: N` | - |
| `GET /categories` (count) | `pageNumber: 1`, `pageSize: 1` | - |
| `GET /bookings` (count) | `pageNumber: 1`, `pageSize: 1` | - |
| `GET /bookings` (list) | `pageNumber: 1`, `pageSize: 100`, `status: 2` (Paid) | `id,userId,eventId,fullname,amount,totalPrice,status,paidAt,createdAt` |
| `GET /events` (recent) | `pageNumber: 1`, `pageSize: 8`, `hasOrganizer: true`, `hasCategory: true`, `isDescending: true` | `id,name,slug,thumbnailUrl,status,category,organizer` |

---

### 6.2 Users (`/admin/users`)

**API:** `GET /api/users`, `POST /api/users`, `GET /api/users/{id}`, `PUT /api/users/{id}`, `DELETE /api/users/{id}`, `PATCH /api/users/{id}`

| Element | Component | Mô tả |
|---------|-----------|-------|
| Page header | H1 + Button "Thêm người dùng" | |
| Filters | Xem bảng Filters bên dưới | `UserGetListQuery` |
| Table | Table (columns: Avatar, fullName, email, phone, role, status, isVerified, actions) | `useGetUsers` |
| Pagination | BasePagination | `pageNumber`, `pageSize`, `totalItems` |
| Create modal | Dialog + Form (fullName, email, phone, password, roleName, status, ...) | `userRequest.create` |
| Edit modal | Dialog + Form (prefill) | `userRequest.update` |
| Delete | AlertDialog confirm → `userRequest.delete` | |
| Restore | DropdownMenu item → `userRequest.restore` | (cho soft-deleted) |

**Filters (Users):**

| Filter | Component | Query param | Type | Mô tả |
|--------|-----------|-------------|------|-------|
| Họ tên | Input (search) | `fullName` | string | Tìm theo tên (contains) |
| Email | Input (search) | `email` | string | Tìm theo email |
| Số điện thoại | Input (search) | `phone` | string | Tìm theo SĐT |
| Vai trò | Select | `roleId` | string (UUID) | Admin, User, Organizer, Guest |
| Trạng thái | Select | `status` | number | Active, Inactive, ... |
| Xác minh | Select | `isVerified` | boolean | Đã xác minh / Chưa xác minh |
| Giới tính | Select | `gender` | number | 0=Nam, 1=Nữ, 2=Khác |
| Có organizer | Select | `organizerId` | string \| null | Có / Không có organizer |
| Có vị trí | Checkbox | `hasLocation` | boolean | User có location |
| Sắp xếp | Select | `isDescending` | boolean | Mới nhất / Cũ nhất |
| Đã xóa | Checkbox | `isDeleted` | boolean | Hiện bản ghi đã xóa |
| Phân trang | BasePagination | `pageNumber`, `pageSize` | number | Mặc định 10/20/50 |

**Fetch Data Default (Users):**

| API | Default params | Fields |
|-----|----------------|--------|
| `GET /users` | `pageNumber: 1`, `pageSize: 10`, `isDescending: true`, `isDeleted: false` | `id,fullName,email,phone,isVerified,status,role,avatarUrl` |

**Query params từ URL:** `fullName`, `email`, `phone`, `roleId`, `status`, `isVerified`, `gender`, `organizerId`, `hasLocation`, `isDescending`, `isDeleted`, `pageNumber`, `pageSize`

**Nested route:** `/admin/users/[id]` — Chi tiết user (profile, bookings, events tham gia). Dùng **Tabs**: Thông tin | Lịch sử đặt vé | Sự kiện đã tham gia.

---

### 6.3 Organizers (`/admin/organizers`)

**API:** `GET /api/organizers`, `POST /api/organizers`, `GET /api/organizers/{id}`, `PUT /api/organizers/{id}`, `DELETE /api/organizers/{id}`, `PATCH /api/organizers/{id}`, `PATCH /api/organizers/{id}/verify`

| Element | Component | Mô tả |
|---------|-----------|-------|
| Page header | H1 + Button "Thêm organizer" | |
| Filters | Xem bảng Filters bên dưới | `OrganizerGetListQuery` |
| Table | Table (columns: Logo, name, email, phone, status, isVerified, events count, actions) | `useGetOrganizers` |
| Pagination | BasePagination | |
| Create modal | Dialog + Form (name, slug, description, logoUrl, email, phone, ...) | `organizerRequest.create` |
| Edit modal | Dialog + Form | `organizerRequest.update` |
| Verify | Button/DropdownMenu → `PATCH /organizers/{id}/verify` | Badge "Pending" → "Verified" |
| Delete / Restore | AlertDialog, DropdownMenu | |

**Filters (Organizers):**

| Filter | Component | Query param | Type | Mô tả |
|--------|-----------|-------------|------|-------|
| Tên | Input (search) | `name` | string | Tìm theo tên organizer |
| Slug | Input (search) | `slug` | string | Tìm theo slug |
| Trạng thái | Select | `status` | OrganizerStatus | 1=Pending, 2=Verified, 3=Banned |
| Sắp xếp | Select | `isDescending` | boolean | Mới nhất / Cũ nhất |
| Đã xóa | Checkbox | `isDeleted` | boolean | Hiện bản ghi đã xóa |
| Phân trang | BasePagination | `pageNumber`, `pageSize` | number | Mặc định 10/20/50 |

**Fetch Data Default (Organizers):**

| API | Default params | Fields |
|-----|----------------|--------|
| `GET /organizers` | `pageNumber: 1`, `pageSize: 20`, `isDescending: true`, `isDeleted: false` | `id,name,slug,email,phone,logoUrl,status,isVerified` |

**Query params từ URL:** `name`, `slug`, `status`, `isDescending`, `isDeleted`, `pageNumber`, `pageSize`

**Nested route:** `/admin/organizers/[id]` — Chi tiết organizer (info, events, revenue). **Tabs**: Thông tin | Sự kiện | Doanh thu.

---

### 6.4 Events (`/admin/events`)

**API:** `GET /api/events`, `POST /api/events`, `GET /api/events/{id}`, `PUT /api/events/{id}`, `DELETE /api/events/{id}`, `PATCH /api/events/{id}`, `PATCH /api/events/{id}/status`

| Element | Component | Mô tả |
|---------|-----------|-------|
| Page header | H1 | |
| Filters | Xem bảng Filters bên dưới | `EventGetListQuery` |
| Table | Table (columns: Thumbnail, name, category, organizer, startTime, status, actions) | `useGetEvents` |
| Pagination | BasePagination | |
| Status update | DropdownMenu (Draft, Published, Opened, Closed, Cancelled) → `PATCH /events/{id}/status` | |
| Delete / Restore | AlertDialog, DropdownMenu | |

**Filters (Admin Events):**

| Filter | Component | Query param | Type | Mô tả |
|--------|-----------|-------------|------|-------|
| Tên sự kiện | Input (search) | `name` | string | Tìm theo tên |
| Slug | Input (search) | `slug` | string | Tìm theo slug |
| Danh mục | Select | `categoryId` | string (UUID) | Lấy từ `useGetCategories` |
| Organizer | Select | `organizerId` | string (UUID) | Lấy từ `useGetOrganizers` |
| Trạng thái | Select | `status` | EventStatus | 1=Draft, 2=Published, 3=Cancelled, 4=Opened, 5=Closed |
| Từ ngày | Popover + Calendar | `startTime` | ISO string | Sự kiện bắt đầu từ |
| Đến ngày | Popover + Calendar | `endTime` | ISO string | Sự kiện kết thúc trước |
| Độ tuổi | Input (number) | `ageRestriction` | number | Giới hạn độ tuổi |
| Include relations | Checkbox | `hasCategory`, `hasOrganizer`, `hasLocations` | boolean | Include nested data |
| Sắp xếp | Select | `isDescending` | boolean | Mới nhất / Cũ nhất |
| Đã xóa | Checkbox | `isDeleted` | boolean | Hiện bản ghi đã xóa |
| Phân trang | BasePagination | `pageNumber`, `pageSize` | number | Mặc định 10/20/50 |

**Fetch Data Default (Admin Events):**

| API | Default params | Fields |
|-----|----------------|--------|
| `GET /events` | `pageNumber: 1`, `pageSize: 20`, `hasCategory: true`, `hasOrganizer: true`, `isDescending: true`, `isDeleted: false` | `id,name,slug,description,thumbnailUrl,startTime,status,category,organizer` |

**Query params từ URL:** `name`, `slug`, `categoryId`, `organizerId`, `status`, `startTime`, `endTime`, `ageRestriction`, `hasCategory`, `hasOrganizer`, `hasLocations`, `isDescending`, `isDeleted`, `pageNumber`, `pageSize`

**Nested route:** `/admin/events/[id]` — Chi tiết sự kiện. **Tabs**: Thông tin | Địa điểm | Đánh giá | Thống kê đặt vé. Form edit inline hoặc modal.

---

### 6.5 Categories (`/admin/categories`)

**API:** `GET /api/categories`, `POST /api/categories`, `GET /api/categories/{id}`, `PUT /api/categories/{id}`, `DELETE /api/categories/{id}`, `PATCH /api/categories/{id}`

| Element | Component | Mô tả |
|---------|-----------|-------|
| Page header | H1 + Button "Thêm danh mục" | |
| Filters | Xem bảng Filters bên dưới | `CategoryGetListQuery` |
| Table | Table (columns: Icon, name, slug, description, status, actions) | `useGetCategories` |
| Pagination | BasePagination | (nếu BE trả paginated) |
| Create modal | Dialog + Form (name, slug, description, iconUrl, status) | `categoryRequest.create` |
| Edit modal | Dialog + Form | `categoryRequest.update` |
| Delete / Restore | AlertDialog, DropdownMenu | |

**Filters (Categories):**

| Filter | Component | Query param | Type | Mô tả |
|--------|-----------|-------------|------|-------|
| Tên danh mục | Input (search) | `name` | string | Tìm theo tên |
| Trạng thái | Select | `status` | CategoryStatus | 1=Active, 2=Inactive |
| Sắp xếp | Select | `isDescending` | boolean | Mới nhất / Cũ nhất |
| Đã xóa | Checkbox | `isDeleted` | boolean | Hiện bản ghi đã xóa |
| Phân trang | BasePagination | `pageNumber`, `pageSize` | number | Mặc định 10/20/50 |

**Fetch Data Default (Categories):**

| API | Default params | Fields |
|-----|----------------|--------|
| `GET /categories` | `pageNumber: 1`, `pageSize: 50`, `isDescending: true`, `isDeleted: false` | `id,name,slug,description,iconUrl,status` |

**Query params từ URL:** `name`, `status`, `isDescending`, `isDeleted`, `pageNumber`, `pageSize`

**Nested route:** `/admin/categories/[id]` — Chi tiết category (subCategories nếu có, events thuộc category).

---

### 6.6 Revenue (`/admin/revenue`)

**API:** `GET /api/bookings` (filter status=Paid), `GET /api/payments` (nếu có)

| Element | Component | Mô tả |
|---------|-----------|-------|
| Stats | Card (Tổng doanh thu, Đơn đã thanh toán, Trung bình đơn hàng) | |
| Chart | Recharts (doanh thu theo ngày/tuần/tháng) | |
| Transactions table | Table (bookingId, customer, amount, paidAt, status) | `bookingRequest.getList` |

**Filters (Revenue):**

| Filter | Component | Query param | Type | Mô tả |
|--------|-----------|-------------|------|-------|
| Trạng thái đơn | Select | `status` | BookingStatus | 1=Pending, 2=Paid, 3=Cancelled |
| User | Select (searchable) | `userId` | string (UUID) | Lọc theo khách hàng |
| Sự kiện | Select (searchable) | `eventId` | string (UUID) | Lọc theo sự kiện |
| Từ ngày | Popover + Calendar | `startDate` (local) | Date | Lọc chart + table |
| Đến ngày | Popover + Calendar | `endDate` (local) | Date | Lọc chart + table |
| Sắp xếp | Select | `isDescending` | boolean | Mới nhất / Cũ nhất |
| Phân trang | BasePagination | `pageNumber`, `pageSize` | number | Cho bảng transactions |

**Fetch Data Default (Revenue):**

| API | Default params | Fields |
|-----|----------------|--------|
| `GET /bookings` | `pageNumber: 1`, `pageSize: 20`, `status: 2` (Paid), `isDescending: true` | `id,userId,eventId,fullname,email,amount,totalPrice,status,paidAt,createdAt` |

**Query params từ URL:** `status`, `userId`, `eventId`, `startDate`, `endDate` (filter client nếu BE không hỗ trợ), `isDescending`, `pageNumber`, `pageSize`

---

## 7. Organizer Sections

### 7.1 Dashboard (`/organizer/dashboard`)

**API:** `useOrganizerStats` (aggregate từ events, bookings theo organizerId)

| Section | Component | Mô tả |
|---------|-----------|-------|
| Header | Card (Organizer Dashboard, updatedAt) | |
| Quick stats | Card (Đang mở, Tổng sự kiện, Vé đã bán) | |
| DashboardStats | Cards (doanh thu, fill rate, ...) | |
| SalesChart | Chart | |
| RecentEvents | Table/Card list | 6 events gần nhất |

**shadcn:** Card, Table, Badge

**Filters (Organizer Dashboard):**

| Filter | Component | Mô tả |
|--------|-----------|-------|
| Khoảng thời gian | Popover + Calendar (date range) | Lọc SalesChart, RecentEvents theo ngày |
| Refresh | Button | Làm mới dữ liệu |

**Fetch Data Default (Organizer Dashboard):**

| API / Data | Default params | Fields |
|------------|----------------|--------|
| `useOrganizerStats` | `organizerId` từ profile | Aggregate: stats, chartData, events |
| Events list | `organizerId`, `pageSize: 6`, `hasCategory: true`, `isDescending: true` | `id,name,startTime,status,locations,sold,total` |

---

### 7.2 Events (`/organizer/events`)

**API:** `GET /api/events` (filter `organizerId` từ profile)

| Element | Component | Mô tả |
|---------|-----------|-------|
| Page header | H1 + Button "Tạo sự kiện" (link to create) | |
| Filters | Xem bảng Filters bên dưới | `EventGetListQuery` + `organizerId` từ profile |
| Table | Table (columns: Thumbnail, name, category, startTime, status, sold/total, actions) | `useGetEvents` |
| Pagination | BasePagination | |
| Actions | Edit, Delete, Restore, Update status | |

**Filters (Organizer Events):**

| Filter | Component | Query param | Type | Mô tả |
|--------|-----------|-------------|------|-------|
| Tên sự kiện | Input (search) | `name` | string | Tìm theo tên |
| Danh mục | Select | `categoryId` | string (UUID) | Lấy từ `useGetCategories` |
| Trạng thái | Select | `status` | EventStatus | 1=Draft, 2=Published, 3=Cancelled, 4=Opened, 5=Closed |
| Từ ngày | Popover + Calendar | `startTime` | ISO string | Sự kiện bắt đầu từ |
| Đến ngày | Popover + Calendar | `endTime` | ISO string | Sự kiện kết thúc trước |
| Sắp xếp | Select | `isDescending` | boolean | Mới nhất / Cũ nhất |
| Đã xóa | Checkbox | `isDeleted` | boolean | Hiện bản ghi đã xóa |
| Phân trang | BasePagination | `pageNumber`, `pageSize` | number | Mặc định 10/20/50 |

*Lưu ý: `organizerId` luôn lấy từ `useGetMe().data.organizerId` — không hiển thị filter.*

**Fetch Data Default (Organizer Events):**

| API | Default params | Fields |
|-----|----------------|--------|
| `GET /events` | `organizerId` (từ profile), `pageNumber: 1`, `pageSize: 20`, `hasCategory: true`, `isDescending: true`, `isDeleted: false` | `id,name,slug,thumbnailUrl,startTime,status,category` |

**Query params từ URL:** `name`, `categoryId`, `status`, `startTime`, `endTime`, `isDescending`, `isDeleted`, `pageNumber`, `pageSize`

**Nested route:** `/organizer/events/[id]` — Chi tiết sự kiện của organizer. **Tabs**: Thông tin | Loại vé | Đơn hàng | Đánh giá. Có nút "Chỉnh sửa" → `/organizer/events/[id]/edit`.

---

### 7.3 Create Event (`/organizer/events/create`)

**API:** `POST /api/events`, `POST /api/tickettypes` (sau khi tạo event)

- Form multi-step hoặc single form (EventCreateBody schema)
- Upload ảnh: `useMedia.uploadImage` (Cloudinary)
- Locations: dynamic array (name, address, latitude, longitude)
- Ticket types (zones): name, price, quantity

**shadcn:** Form, Input, Select, Textarea, Button, Card

---

### 7.4 Orders (`/organizer/orders`)

**API:** `GET /api/bookings` (filter `eventId` qua events của organizer), `GET /api/bookingdetails`

| Element | Component | Mô tả |
|---------|-----------|-------|
| Page header | H1 | |
| Filters | Xem bảng Filters bên dưới | `BookingGetListQuery` |
| Table | Table (columns: bookingId, customer, event, amount, totalPrice, status, paidAt, actions) | `useGetBookings` |
| Pagination | BasePagination | |
| Export | Button "Xuất CSV" | (đã có logic trong AttendeesList) |

**Filters (Organizer Orders):**

| Filter | Component | Query param | Type | Mô tả |
|--------|-----------|-------------|------|-------|
| Sự kiện | Select (searchable) | `eventId` | string (UUID) | Chọn sự kiện — lấy từ `useGetEvents({ organizerId })` |
| Trạng thái | Select | `status` | BookingStatus | 1=Pending, 2=Paid, 3=Cancelled |
| Tìm khách | Input (search) | - | string | Tìm theo fullname/email (filter client-side hoặc BE nếu hỗ trợ) |
| Từ ngày | Popover + Calendar | - | Date | Lọc theo createdAt/paidAt (client-side hoặc extend API) |
| Đến ngày | Popover + Calendar | - | Date | |
| Sắp xếp | Select | `isDescending` | boolean | Mới nhất / Cũ nhất |
| Phân trang | BasePagination | `pageNumber`, `pageSize` | number | Mặc định 10/20/50 |

**Fetch Data Default (Organizer Orders):**

| API | Default params | Fields |
|-----|----------------|--------|
| `GET /events` | `organizerId`, `pageSize: 100` | `id,name` (cho Select filter) |
| `GET /bookings` | `eventId` (optional), `pageNumber: 1`, `pageSize: 20`, `isDescending: true` | `id,userId,eventId,fullname,email,amount,totalPrice,status,paidAt,createdAt,bookingDetails` |

**Query params từ URL:** `eventId`, `status`, `isDescending`, `pageNumber`, `pageSize`

**Nested route:** `/organizer/orders/[id]` — Chi tiết đơn hàng (booking + bookingDetails, attendee list). Dùng **Card** + **Table** cho bookingDetails.

---

### 7.5 Earnings (`/organizer/earnings`)

**API:** `GET /api/bookings` (filter organizer events, status=Paid), withdraw (nếu BE có)

| Element | Component | Mô tả |
|---------|-----------|-------|
| Stats | Card (Tổng thu, Đã rút, Còn lại) | |
| Transactions | Table (date, event, amount, status) | |
| Withdraw modal | Dialog + Form | (nếu BE hỗ trợ) |

**Filters (Earnings):**

| Filter | Component | Query param | Type | Mô tả |
|--------|-----------|-------------|------|-------|
| Sự kiện | Select (searchable) | `eventId` | string (UUID) | Lọc giao dịch theo sự kiện |
| Từ ngày | Popover + Calendar | `startDate` (local) | Date | Lọc theo paidAt |
| Đến ngày | Popover + Calendar | `endDate` (local) | Date | |
| Trạng thái | Select | `status` | BookingStatus | Chỉ Paid (mặc định) hoặc tất cả |

**Fetch Data Default (Earnings):**

| API | Default params | Fields |
|-----|----------------|--------|
| `GET /bookings` | `eventId` (optional), `status: 2` (Paid), `pageNumber: 1`, `pageSize: 20`, `isDescending: true` | `id,eventId,fullname,amount,totalPrice,status,paidAt,createdAt` |

**Query params từ URL:** `eventId`, `status`, `startDate`, `endDate` (client filter nếu cần)

---

### 7.6 Profile (`/organizer/profile`)

**API:** `GET /api/users/{id}`, `PUT /api/users/{id}`, `GET /api/organizers/{id}`, `PUT /api/organizers/{id}`

- Form chỉnh sửa thông tin user + organizer
- **shadcn:** Form, Input, Avatar, Button

---

## 8. Nested Routes chi tiết

### 8.1 `/admin/users/[id]`

| Tab | Content | API |
|-----|---------|-----|
| Thông tin | Form view/edit (fullName, email, phone, role, status, ...) | `userRequest.getById`, `userRequest.update` |
| Lịch sử đặt vé | Table bookings (userId filter) | `bookingRequest.getList({ userId })` |
| Sự kiện đã tham gia | Table events (qua bookings) | Derived |

**Filters (Tab Lịch sử đặt vé):** `status` (BookingStatus), `eventId`, `pageNumber`, `pageSize`, `isDescending`

---

### 8.2 `/admin/organizers/[id]`

| Tab | Content | API |
|-----|---------|-----|
| Thông tin | Form view/edit + Verify button | `organizerRequest.getById`, `organizerRequest.update`, `organizerRequest.verify` |
| Sự kiện | Table events (organizerId filter) | `eventRequest.getList({ organizerId })` |
| Doanh thu | Chart + Table bookings | `bookingRequest.getList` (qua events) |

**Filters (Tab Sự kiện):** `status`, `categoryId`, `startTime`, `endTime`, `pageNumber`, `pageSize`, `isDescending`  
**Filters (Tab Doanh thu):** `status`, `startDate`, `endDate`, `pageNumber`, `pageSize`, `isDescending`

---

### 8.3 `/admin/events/[id]`

| Tab | Content | API |
|-----|---------|-----|
| Thông tin | Form view/edit (name, description, locations, ...) | `eventRequest.getById`, `eventRequest.update` |
| Địa điểm | Table locations | Nested trong event |
| Đánh giá | Table eventReviews (eventId filter) | `eventReviewRequest.getList({ eventId })` |
| Thống kê đặt vé | Table bookings (eventId filter) | `bookingRequest.getList({ eventId })` |

**Filters (Tab Đánh giá):** `userId`, `rating` (min/max hoặc exact), `pageNumber`, `pageSize`, `isDescending`  
**Filters (Tab Thống kê đặt vé):** `status`, `pageNumber`, `pageSize`, `isDescending`

---

### 8.4 `/admin/categories/[id]`

| Tab | Content | API |
|-----|---------|-----|
| Thông tin | Form view/edit | `categoryRequest.getById`, `categoryRequest.update` |
| Sự kiện | Table events (categoryId filter) | `eventRequest.getList({ categoryId })` |

**Filters (Tab Sự kiện):** `name`, `status`, `organizerId`, `startTime`, `endTime`, `pageNumber`, `pageSize`, `isDescending`

---

### 8.5 `/organizer/events/[id]`

| Tab | Content | API |
|-----|---------|-----|
| Thông tin | Form view/edit | `eventRequest.getById`, `eventRequest.update` |
| Loại vé | Table ticketTypes (eventId filter) | `ticketTypeRequest.getList({ eventId })` |
| Đơn hàng | Table bookings (eventId filter) | `bookingRequest.getList({ eventId })` |
| Đánh giá | Table eventReviews | `eventReviewRequest.getList({ eventId })` |

**Filters (Tab Loại vé):** `name`, `fromPrice`, `toPrice`, `pageNumber`, `pageSize`, `isDescending`  
**Filters (Tab Đơn hàng):** `status`, `pageNumber`, `pageSize`, `isDescending`  
**Filters (Tab Đánh giá):** `userId`, `rating`, `pageNumber`, `pageSize`, `isDescending`

---

### 8.6 `/organizer/orders/[id]`

- Card: Booking info (fullname, email, phone, totalPrice, status, paidAt)
- Table: BookingDetails (ticketType, quantity, pricePerTicket, totalPrice)
- (Optional) Attendees list nếu BE trả thêm

*Không có filter — trang chi tiết đơn hàng đơn lẻ.*

---

## 9. Tổng hợp Filters theo Section

| Section | Filters chính | Query params |
|---------|---------------|--------------|
| **Admin Dashboard** | Date range, Refresh | `startDate`, `endDate` |
| **Admin Users** | fullName, email, phone, roleId, status, isVerified, gender, organizerId, hasLocation, isDescending, isDeleted | `UserGetListQuery` |
| **Admin Organizers** | name, slug, status, isDescending, isDeleted | `OrganizerGetListQuery` |
| **Admin Events** | name, slug, categoryId, organizerId, status, startTime, endTime, ageRestriction, hasCategory, hasOrganizer, hasLocations, isDescending, isDeleted | `EventGetListQuery` |
| **Admin Categories** | name, status, isDescending, isDeleted | `CategoryGetListQuery` |
| **Admin Revenue** | status, userId, eventId, startDate, endDate, isDescending | `BookingGetListQuery` |
| **Organizer Dashboard** | Date range, Refresh | local state |
| **Organizer Events** | name, categoryId, status, startTime, endTime, isDescending, isDeleted | `EventGetListQuery` + organizerId |
| **Organizer Orders** | eventId, status, search (fullname/email), date range, isDescending | `BookingGetListQuery` |
| **Organizer Earnings** | eventId, startDate, endDate, status | `BookingGetListQuery` |
| **Event detail - Đánh giá** | userId, rating, isDescending | `EventReviewGetListQuery` |
| **Event detail - Đơn hàng** | status, isDescending | `BookingGetListQuery` |
| **Event detail - Loại vé** | name, fromPrice, toPrice, isDescending | `TicketTypeGetListQuery` |

---

## 10. Default Fetch Params — Tổng hợp

| Section | API | Default params |
|---------|-----|----------------|
| Admin Users | `GET /users` | `pageNumber: 1`, `pageSize: 10`, `isDescending: true`, `isDeleted: false` |
| Admin Organizers | `GET /organizers` | `pageNumber: 1`, `pageSize: 20`, `isDescending: true`, `isDeleted: false` |
| Admin Events | `GET /events` | `pageNumber: 1`, `pageSize: 20`, `hasCategory: true`, `hasOrganizer: true`, `isDescending: true`, `isDeleted: false` |
| Admin Categories | `GET /categories` | `pageNumber: 1`, `pageSize: 50`, `isDescending: true`, `isDeleted: false` |
| Admin Revenue | `GET /bookings` | `pageNumber: 1`, `pageSize: 20`, `status: 2`, `isDescending: true` |
| Org Events | `GET /events` | `organizerId` + `pageNumber: 1`, `pageSize: 20`, `hasCategory: true`, `isDescending: true`, `isDeleted: false` |
| Org Orders | `GET /bookings` | `pageNumber: 1`, `pageSize: 20`, `isDescending: true` |
| Org Earnings | `GET /bookings` | `status: 2`, `pageNumber: 1`, `pageSize: 20`, `isDescending: true` |

---

## 11. API ↔ FE Mapping

| BE Endpoint | FE apiRequest | Hook | Page |
|-------------|---------------|------|------|
| `GET/POST/PUT/DELETE/PATCH /users` | `userRequest` | `useGetUsers`, `useGetMe` | Admin Users |
| `GET/POST/PUT/DELETE/PATCH /roles` | `roleRequest` | `useGetRoles` | (Form select) |
| `GET/POST/PUT/DELETE/PATCH /organizers` | `organizerRequest` | `useGetOrganizers` | Admin Organizers, Org Profile |
| `GET/POST/PUT/DELETE/PATCH /events` | `eventRequest` | `useGetEvents`, `useEvent` | Admin Events, Org Events |
| `GET/POST/PUT/DELETE/PATCH /categories` | `categoryRequest` | `useGetCategories`, `useCategory` | Admin Categories |
| `GET/POST/PUT/DELETE/PATCH /eventreviews` | `eventReviewRequest` | `useGetEventReviews` | Event detail tabs |
| `GET/POST /bookings` | `bookingRequest` | `useGetBookings`, `useBooking` | Admin Revenue, Org Orders |
| `GET /bookingdetails` | `bookingDetailRequest` | `useGetBookingDetails` | Order detail |
| `GET /tickettypes` | `ticketTypeRequest` | `useGetTicketTypes`, `useTicketType` | Event create, Event detail |
| `GET /paymentmethods` | `paymentMethodRequest` | `useGetPaymentMethods` | (Form select) |

---

## 12. CRUD Pattern chuẩn

Mỗi section CRUD tuân theo:

1. **List page**: Filters (Input, Select) + Table + Pagination + "Thêm mới" button
2. **Create**: Dialog/Sheet với Form (zod schema) → `mutation.mutateAsync` → `queryClient.invalidateQueries` → toast success
3. **Edit**: Dialog/Sheet với Form prefill → `mutation.mutateAsync` → invalidate → toast
4. **Delete**: AlertDialog confirm → `delete.mutateAsync` → invalidate → toast
5. **Restore**: DropdownMenu item (chỉ khi `isDeleted=true`) → `restore.mutateAsync` → invalidate
6. **Row actions**: DropdownMenu (Edit, Delete, Restore, View detail link)

---

## 13. File structure đề xuất

```
src/
├── app/(dashboard)/
│   ├── layout.tsx                 # Shared layout
│   ├── admin/
│   │   ├── dashboard/page.tsx     # Server Component + Suspense
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   ├── _components/
│   │   │   │   ├── UsersFilters.tsx   # Client, params từ props
│   │   │   │   └── UsersTable.tsx     # Client, params từ props, trong Suspense
│   │   │   └── [id]/page.tsx
│   │   ├── organizers/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── categories/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── revenue/page.tsx
│   │   └── profile/page.tsx
│   └── organizer/
│       ├── dashboard/page.tsx
│       ├── events/
│       │   ├── page.tsx
│       │   ├── create/page.tsx
│       │   └── [id]/page.tsx
│       ├── orders/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── earnings/page.tsx
│       └── profile/page.tsx
├── components/
│   ├── base/
│   │   ├── BaseFilter.tsx         # Filter params qua props, sync URL
│   │   ├── BaseFilterHeader.tsx   # Title + Filter + Actions
│   │   ├── BasePagination.tsx    # Đã có
│   │   └── SectionFallback.tsx   # Skeleton: table | cards | chart | list
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── DashboardSidebar.tsx
│   │   └── DashboardHeader.tsx
│   └── dashboard/
│       ├── DataTable.tsx
│       └── ...
```

---

## 14. Lưu ý triển khai

1. **Route group `(dashboard)`**: Dùng route group để share layout, không ảnh hưởng URL.
2. **Role guard**: Layout đọc `useSessionStore.user.Role` → render nav + redirect nếu sai role.
3. **Proxy/middleware**: Đảm bảo `/admin/*` chỉ ADMIN, `/organizer/*` chỉ ORGANIZER (đã có trong `proxy.ts`).
4. **Base URL**: FE gọi qua `NEXT_PUBLIC_API_URL` (gateway). Endpoint prefix `/api` được gateway route tới từng service.
5. **Pagination**: BE trả `totalItems`, `pageNumber`, `pageSize`, `totalPages`, `items`. FE dùng `BasePagination` component.
6. **Server Components**: Page là async Server Component — đọc `searchParams` từ URL, truyền `params` xuống client sections.
7. **Suspense + key**: `Suspense key={JSON.stringify(params)}` — khi params đổi → boundary remount → fallback hiển thị → fetch mới.
8. **BaseFilter**: Nhận `params` qua props, cập nhật URL qua `router.push` — page re-render với `searchParams` mới.
