
import type z from "zod"
import ClientBrokerageSettings, { schema } from "./table"


const clientInfo = {
  clientId: "ABCD11",
}


const availableSegments = [
  { name: "BSE", enabled: true },
  { name: "NSE", enabled: true },
  { name: "MCX", enabled: false },
  { name: "NCDEX", enabled: true },
]

const scripts: z.infer<typeof schema>[] = [
  {
    id: 1,
    tickerId: "RELIANCE",
    name: "Reliance Industries",
    segment: "NSE",
    maxQty: 1000,
    masterStatus: "Active",
  },
  {
    id: 2,
    tickerId: "SBIN",
    name: "State Bank of India",
    segment: "BSE",
    maxQty: 500,
    masterStatus: "Blocked",
  },
  {
    id: 3,
    tickerId: "TCS",
    name: "Tata Consultancy Services",
    segment: "NSE",
    maxQty: 300,
    masterStatus: "Active",
  },
  {
    id: 4,
    tickerId: "HDFCBANK",
    name: "HDFC Bank",
    segment: "BSE",
    maxQty: 400,
    masterStatus: "Blocked",
  },
  {
    id: 5,
    tickerId: "GOLDMCX",
    name: "Gold Futures",
    segment: "MCX",
    maxQty: 150,
    masterStatus: "Active",
  },
  {
    id: 6,
    tickerId: "SOYNCDEX",
    name: "Soybean",
    segment: "NCDEX",
    maxQty: 200,
    masterStatus: "Blocked",
  },
]

function Client() {
  return (
    <div>
      <ClientBrokerageSettings initialData={scripts}
        availableSegments={availableSegments}
        clientId={clientInfo.clientId} />
    </div>
  )
}

export default Client