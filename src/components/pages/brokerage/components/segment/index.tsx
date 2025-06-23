import { Button } from "@/components/ui/button"
import SegmentBlocks from "./SegmentBlocks"

const segments = [
    { title: "NSE", subtitle: "Fixed", seg: "NSE", adminValue: 1000, masterValue: 2000, percentage: false },
    { title: "BSE", subtitle: "Fixed", seg: "BSE", adminValue: 1500, masterValue: 1800, percentage: false },
    { title: "MCX", subtitle: "Variable", seg: "F&O", adminValue: 2000, masterValue: 1200, percentage: true },
    { title: "MCX", subtitle: "Variable", seg: "NCEDX", adminValue: 2000, masterValue: 1200, percentage: true },
    { title: "MCX", subtitle: "Variable", seg: "MCX", adminValue: 2000, masterValue: 1200, percentage: true },
    { title: "MCX", subtitle: "Variable", seg: "MCX", adminValue: 2000, masterValue: 1200, percentage: true },
    { title: "MCX", subtitle: "Variable", seg: "MCX", adminValue: 2000, masterValue: 1200, percentage: true },
    { title: "MCX", subtitle: "Variable", seg: "MCX", adminValue: 2000, masterValue: 1200, percentage: true },
]

export default function Segment() {
  return (
    <div className="flex flex-col h-full max-h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-card border-b px-4 py-2">
        <h2 className="text-lg font-semibold">Segment Overview</h2>
        <p className="text-sm text-muted-foreground">
          Summary of each segment — Admin values are fixed and visually distinct.
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto px-4 pt-4 pb-36">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((seg, index) => (
            <SegmentBlocks
              key={index}
              title={seg.title}
              subtitle={seg.subtitle}
              seg={seg.seg}
              adminValue={seg.adminValue}
              masterValue={seg.masterValue}
              percentage={seg.percentage}
            />
          ))}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-20 bg-card border-t px-4 py-4">
        <div className="flex justify-end">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// export default Segment
