import data from "./data.json"
import EditableTable from "./data-table"
import z from "zod";


const schema = z.object({
  id: z.number(),
  name: z.string(),
  segment: z.string(),
  minLot: z.number(),
  maxLot: z.number(),
  maxQty: z.number(),
  qtyPerLot: z.number(),
  adminStatus: z.enum(["Active", "Blocked"]),
  masterStatus: z.enum(["Active", "Blocked"]),
})

function Script() {
  const validatedData = z.array(schema).parse(data);
  return (
    <div>
      <EditableTable initialData={validatedData} />
    </div>
  )
}

export default Script