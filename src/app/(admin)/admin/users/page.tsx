
import UsersList from "./_components/UsersList";
import UsersFilters from "./_components/UsersFilters";
import { mockUsers } from "@/utils/mockAdmin";


export default function AdminUsersPage() {
  const users = mockUsers;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
        <p className="text-muted-foreground mt-2">
          Xem và quản lý tất cả người dùng trên nền tảng
        </p>
      </div>

      <UsersFilters />

      <UsersList users={users} />
    </div>
  );
}
