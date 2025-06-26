import data from "./data.json"
import EditableTable from "./data-table"
function Ticker() {
  return (
    <div>
      <EditableTable initialData={data} />
    </div>
  )
}

export default Ticker