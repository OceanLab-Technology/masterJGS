import data from "@/components/pages/brokerage/components/Ticker/data.json"
import EditableTable from "@/components/pages/brokerage/components/Ticker/data-table"
function Ticker() {
  return (
    <div>
      <EditableTable initialData={data} />
    </div>
  )
}

export default Ticker