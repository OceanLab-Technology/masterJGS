import DashboardLayout from "@/components/layout/DashboardLayout";
import UserList from "./components/UserList/index";

export default function UserManagement() {
  return (
    <DashboardLayout title="User Management">
      <div className="flex flex-col flex-1 min-h-0 bg-muted/50 rounded-xl mt-4 pt-6 px-6">
        <UserList />
      </div>
    </DashboardLayout>
  );
}
