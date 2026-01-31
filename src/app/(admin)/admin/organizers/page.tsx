import OrganizersList from "./_components/OrganizersList";
import OrganizersFilters from "./_components/OrganizersFilters";
import AdminPageHeader from "@/components/layout/admin/AdminPageHeader";
import { mockOrganizers } from "@/utils/mockAdmin";

export default function AdminOrganizersPage() {
  const organizers = mockOrganizers;
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản lý Organizer"
        description="Xem và phê duyệt đơn đăng ký tổ chức sự kiện"
      />
      <OrganizersFilters />
      <OrganizersList organizers={organizers} />
    </div>
  );
}
