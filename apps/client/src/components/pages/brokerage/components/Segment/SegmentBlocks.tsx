import { useState } from "react"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { CircleDollarSign } from "@repo/ui/icons"
import { CardContent } from "@repo/ui/components/card"

type SegmentBlocksProps = {
  id: number
  title: string
  admin_value: number
  master_value: number
  percentage: boolean
  is_blocked: boolean
  onUpdateMasterValue: (val: number) => void
}

// Define color classes
const segmentColorMap: Record<string, { bg: string; text: string; icon: string }> = {
  NSE: { bg: "bg-blue-100", text: "text-blue-600", icon: "text-blue-600" },
  BSE: { bg: "bg-green-100", text: "text-green-600", icon: "text-green-600" },
  "F&O": { bg: "bg-yellow-100", text: "text-yellow-700", icon: "text-yellow-700" },
  MCX: { bg: "bg-purple-100", text: "text-purple-600", icon: "text-purple-600" },
  NCEDX: { bg: "bg-red-100", text: "text-red-600", icon: "text-red-600" },
}

function SegmentBlocks({
  title,
  admin_value,
  master_value,
  percentage,
  is_blocked,
  onUpdateMasterValue,
}: SegmentBlocksProps) {
  const symbol = percentage ? "%" : "₹"
  const color = segmentColorMap[title] || { bg: "bg-gray-100", text: "text-gray-600", icon: "text-gray-600" }
  const [value, setValue] = useState(master_value)

  const handleBlur = () => {
    if (value !== master_value) {
      onUpdateMasterValue(value)
    }
  }

  return (
    <CardContent className="p-0">
      <div className="rounded-2xl border border-border bg-muted/10 p-6 shadow-sm w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <CircleDollarSign className={`h-5 w-5 ${color.text}`} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">{"hello"}</p>
            </div>
          </div>
          <span className={`rounded-full ${color.bg} ${color.text} text-xs font-medium px-3 py-1`}>
            {title}
          </span>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label className="text-sm text-foreground">Admin Value</Label>
            <div className="mt-1 h-10 flex items-center rounded-md border border-border bg-background/20 px-3 text-muted-foreground font-medium">
              {symbol} {admin_value}
            </div>
          </div>

          <div>
            <Label className="text-sm text-foreground">Master Value</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {symbol}
              </span>
              <Input
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                onBlur={handleBlur}
                disabled={is_blocked}
                className="pl-7 h-10 bg-background border border-border text-foreground rounded-md font-medium"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm text-foreground">Total Value</Label>
            <div className="mt-1 h-10 flex items-center rounded-md border border-border bg-background/20 px-3 text-muted-foreground font-medium">
              {symbol} {admin_value + value}
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  )
}

export default SegmentBlocks
