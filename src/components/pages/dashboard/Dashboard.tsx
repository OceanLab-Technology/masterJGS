import DashboardLayout from "@/components/layout/DashboardLayout"

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard Home">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 flex-1 rounded-xl" />
    </DashboardLayout>
  )
}
