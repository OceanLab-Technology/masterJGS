import data from "./data.json"
import EditableTable from "./data-table"
import z from "zod";

const schema = z.object({
  id: z.number(),
  scriptName: z.string(),
  symbol: z.string(),
  segment: z.enum(["BSE", "NSE", "MCX"]),
  type: z.enum(["%", "₹"]),
  adminValue: z.number(),
  masterValue: z.number(),
});

function Ticker() {
  const validatedData = z.array(schema).parse(data);
  return (
    <div>
      <EditableTable initialData={validatedData} />
    </div>
  )
}

export default Ticker