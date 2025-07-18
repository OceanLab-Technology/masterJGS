import type z from "zod";
import ClientBrokerageSettings, { schema } from "./table";

const mockClients = [
  { clientId: "ABCD11", clientName: "John Doe" },
  { clientId: "EFGH22", clientName: "Jane Smith" },
  { clientId: "IJKL33", clientName: "Bob Johnson" },
  { clientId: "MNOP44", clientName: "Alice Brown" },
  { clientId: "QRST55", clientName: "Charlie Wilson" },
];

const availableSegments = [
  { name: "BSE", enabled: true },
  { name: "NSE", enabled: true },
  { name: "MCX", enabled: false },
  { name: "NCDEX", enabled: true },
];

const clientScriptsData: Record<string, z.infer<typeof schema>[]> = {
  ABCD11: [
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
  ],
  EFGH22: [
    {
      id: 4,
      tickerId: "HDFCBANK",
      name: "HDFC Bank",
      segment: "BSE",
      maxQty: 400,
      masterStatus: "Active",
    },
    {
      id: 5,
      tickerId: "GOLDMCX",
      name: "Gold Futures",
      segment: "MCX",
      maxQty: 150,
      masterStatus: "Blocked",
    },
  ],
  IJKL33: [
    {
      id: 6,
      tickerId: "SOYNCDEX",
      name: "Soybean",
      segment: "NCDEX",
      maxQty: 200,
      masterStatus: "Active",
    },
    {
      id: 7,
      tickerId: "WIPRO",
      name: "Wipro Limited",
      segment: "NSE",
      maxQty: 600,
      masterStatus: "Active",
    },
  ],
  MNOP44: [
    {
      id: 8,
      tickerId: "INFY",
      name: "Infosys Limited",
      segment: "NSE",
      maxQty: 800,
      masterStatus: "Active",
    },
  ],
  QRST55: [
    {
      id: 9,
      tickerId: "ICICIBANK",
      name: "ICICI Bank",
      segment: "BSE",
      maxQty: 700,
      masterStatus: "Blocked",
    },
  ],
};

function Client() {
  return (
    <div className="space-y-4">
      <ClientBrokerageSettings
        initialData={clientScriptsData[mockClients[0].clientId] || []}
        availableSegments={availableSegments}
        clientData={mockClients}
        clientScriptsData={clientScriptsData}
      />
    </div>
  );
}

export default Client;
