import UsersList from "./_components/UsersList";
import UsersFilters from "./_components/UsersFilters";
import AdminPageHeader from "@/components/layout/admin/AdminPageHeader";
import { mockUsers } from "@/utils/mockAdmin";

export default function AdminUsersPage() {
  const users = mockUsers;
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản lý người dùng"
        description="Xem và quản lý tất cả người dùng trên nền tảng"
      />
      <UsersFilters />
      <UsersList users={users} />
    </div>
  );
}
