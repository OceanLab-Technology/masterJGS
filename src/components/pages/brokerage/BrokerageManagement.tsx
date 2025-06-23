import DashboardLayout from "@/components/layout/DashboardLayout"
// import Tabs from "../common/components/tabs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Segment from "./components/segment/index"
import Ticker from "./components/Ticker";
import Client from "./components/Client";


export default function BrokerageManagement() {
  return (
    <DashboardLayout title="Brokerage Management">
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl mt-4 pt-6 px-6 w-full">
        {/* <Tabs options={["Day", "Hello"]} /> */}
        <Tabs defaultValue="Segment" className="w-full">
          <TabsList>
            <TabsTrigger value="Segment">Segment Wise</TabsTrigger>
            <TabsTrigger value="Ticker">Ticker Wise</TabsTrigger>
            <TabsTrigger value="Client">Client Wise</TabsTrigger>
          </TabsList>
          <TabsContent value="Segment">
            <Segment />
          </TabsContent>
          <TabsContent value="Ticker">
            <Ticker />
          </TabsContent>
          <TabsContent value="Client">
            <Client />
          </TabsContent>

        </Tabs>

      </div>
    </DashboardLayout>
  )
}
