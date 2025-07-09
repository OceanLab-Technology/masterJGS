import DashboardLayout from "@/components/layout/DashboardLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs"
import Segment from "./components/Segment/index"
import Ticker from "./components/Ticker/index";
import Client from "./components/Client/index";

export default function BrokerageManagement() {
  return (
    <DashboardLayout title="Brokerage Management">
      {/* This outer wrapper must fill the available height */}
      <div className="flex flex-col flex-1 min-h-0 bg-muted/50 rounded-xl mt-4 pt-6 px-6">
        <Tabs defaultValue="Segment" className="flex flex-col flex-1 min-h-0">
          <TabsList>
            <TabsTrigger value="Segment">Segment Wise</TabsTrigger>
            <TabsTrigger value="Ticker">Ticker Wise</TabsTrigger>
            <TabsTrigger value="Client">Client Wise</TabsTrigger>
          </TabsList>

          <TabsContent value="Segment" className="flex-1 min-h-0 overflow-hidden">
            <Segment />
          </TabsContent>
          <TabsContent value="Ticker" className="flex-1 min-h-0 overflow-auto">
            <Ticker />
          </TabsContent>
          <TabsContent value="Client" className="flex-1 min-h-0 overflow-hidden">
            <Client />
          </TabsContent>
        </Tabs>
      </div>

    </DashboardLayout>
  );
}
