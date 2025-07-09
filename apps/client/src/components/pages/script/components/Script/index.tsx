import data from "./data.json"
import EditableTable from "./data-table"
function Script() {
  return (
    <div>
      <EditableTable initialData={data} />
    </div>
  )
}

export default Script