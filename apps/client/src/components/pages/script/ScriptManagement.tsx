import DashboardLayout from "@/components/layout/DashboardLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs"
import Script from "@/components/pages/script/components/Script/index";
import Client from "@/components/pages/script/components/Client/index";

export default function ScriptManagement() {
  return (
    <DashboardLayout title="Script Management">
      {/* This outer wrapper must fill the available height */}
      <div className="flex flex-col flex-1 min-h-0 bg-muted/50 rounded-xl mt-4 pt-6 px-6">
        <Tabs defaultValue="Script" className="flex flex-col flex-1 min-h-0">
          <TabsList>
            <TabsTrigger value="Script">Script Wise</TabsTrigger>
            <TabsTrigger value="Client">Client Wise</TabsTrigger>
          </TabsList>
          <TabsContent value="Script" className="flex-1 min-h-0 overflow-auto">
            <Script />
          </TabsContent>
          <TabsContent value="Client" className="flex-1 min-h-0 overflow-hidden">
            <Client />
          </TabsContent>
        </Tabs>
      </div>

    </DashboardLayout>
  );
}
