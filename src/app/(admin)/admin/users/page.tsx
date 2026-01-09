import { Suspense } from "react";
import Loading from "@/components/loading";
import UsersList from "./_components/UsersList";
import UsersFilters from "./_components/UsersFilters";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
        <p className="text-muted-foreground mt-2">
          Xem và quản lý tất cả người dùng trên nền tảng
        </p>
      </div>

      <UsersFilters />
      
      <Suspense fallback={<Loading />}>
        <UsersList />
      </Suspense>
    </div>
  );
}
