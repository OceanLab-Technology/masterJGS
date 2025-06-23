import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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

function Segment() {
    return (
        <Card className="bg-card text-card-foreground rounded-xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold">Segment Overview</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            Summary of each segment — Admin values are fixed and visually distinct.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6 w-full">
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

            <CardFooter>
                <Button className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90">
                    Save Changes
                </Button>
            </CardFooter>
        </Card>
    )
}

export default Segment
