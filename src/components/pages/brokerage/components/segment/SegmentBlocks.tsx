// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { CircleDollarSign } from "lucide-react"
// import { CardContent } from "@/components/ui/card"

// type SegmentBlocksProps = {
//   title: string
//   subtitle: string
//   seg: string
//   adminValue: number
//   masterValue: number
//   percentage: boolean
// }

// function SegmentBloc({
//   title,
//   subtitle,
//   seg,
//   adminValue,
//   masterValue,
//   percentage,
// }: SegmentBlocksProps) {
//   const symbol = percentage ? "%" : "₹"

//   return (
//     <CardContent className="space-y-6">
//       <div className="rounded-2xl border border-border bg-muted/10 p-6 shadow-sm">
//         {/* Header Section */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-4">
//             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
//               <CircleDollarSign className="h-5 w-5" />
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold text-foreground">{title}</h2>
//               <p className="text-sm text-muted-foreground">{subtitle}</p>
//             </div>
//           </div>
//           <span className="rounded-full bg-primary/10 text-primary text-xs font-semibold px-4 py-1">
//             {seg}
//           </span>
//         </div>

//         {/* Value Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//           {/* Admin Value */}
//           <div>
//             <Label className="text-sm mb-1 block text-foreground">Admin Value</Label>
//             <div className="flex h-10 items-center rounded-md border border-border bg-muted px-3 text-muted-foreground">
//               {symbol} {adminValue}
//             </div>
//           </div>

//           {/* Master Value Input */}
//           <div>
//             <Label htmlFor="master-value" className="text-sm mb-1 block text-foreground">Master Value</Label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
//                 {symbol}
//               </span>
//               <Input
//                 id="master-value"
//                 defaultValue={masterValue}
//                 className="pl-7 h-10 bg-background text-foreground border-border hover:border-primary transition"
//               />
//             </div>
//           </div>

//           {/* Total Value */}
//           <div>
//             <Label className="text-sm mb-1 block text-foreground">Total Value</Label>
//             <div className="flex h-10 items-center rounded-md border border-border bg-background/20 px-3 text-foreground font-medium">
//               {symbol} {adminValue + masterValue}
//             </div>
//           </div>
//         </div>
//       </div>
//     </CardContent>
//   )
// }

// export default SegmentBloc


// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { CircleDollarSign } from "lucide-react"
// import { CardContent } from "@/components/ui/card"

// type SegmentBlocksProps = {
//   title: string
//   subtitle: string
//   seg: string
//   adminValue: number
//   masterValue: number
//   percentage: boolean
// }

// function SegmentBlocks({
//   title,
//   subtitle,
//   seg,
//   adminValue,
//   masterValue,
//   percentage,
// }: SegmentBlocksProps) {
//   const symbol = percentage ? "%" : "₹"

//   return (
//     <CardContent className="space-y-6 ">
//     <div className="rounded-2xl border border-border bg-muted/10 p-6 shadow-sm w-full max-w-sm">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
//             <CircleDollarSign className="h-5 w-5" />
//           </div>
//           <div>
//             <h3 className="text-base font-semibold text-foreground">{title}</h3>
//             <p className="text-xs text-muted-foreground">{subtitle}</p>
//           </div>
//         </div>
//         <span className="rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1">
//           {seg}
//         </span>
//       </div>

//       {/* Grid */}
//       <div className="grid grid-cols-1 gap-4">
//         {/* Admin Value */}
//         <div>
//           <Label className="text-sm text-foreground">Admin Value</Label>
//           <div className="mt-1 h-10 flex items-center rounded-md border border-border bg-muted px-3 text-muted-foreground">
//             {symbol} {adminValue}
//           </div>
//         </div>

//         {/* Master Value */}
//         <div>
//           <Label className="text-sm text-foreground">Master Value</Label>
//           <div className="relative mt-1">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
//               {symbol}
//             </span>
//             <Input
//               defaultValue={masterValue}
//               className="pl-7 h-10 bg-background border-border rounded-md"
//             />
//           </div>
//         </div>

//         {/* Total Value */}
//         <div>
//           <Label className="text-sm text-foreground">Total Value</Label>
//           <div className="mt-1 h-10 flex items-center rounded-md border border-border bg-background/20 px-3 text-foreground font-medium">
//             {symbol} {adminValue + masterValue}
//           </div>
//         </div>
//       </div>
//     </div>
//     </CardContent>
//   )
// }

// export default SegmentBlocks

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CircleDollarSign } from "lucide-react"
import { CardContent } from "@/components/ui/card"

type SegmentBlocksProps = {
  title: string
  subtitle: string
  seg: string
  adminValue: number
  masterValue: number
  percentage: boolean
}

// Define color classes for each segment
const segmentColorMap: Record<string, { bg: string; text: string; icon: string }> = {
  NSE: { bg: "bg-blue-100", text: "text-blue-600", icon: "text-blue-600" },
  BSE: { bg: "bg-green-100", text: "text-green-600", icon: "text-green-600" },
  "F&O": { bg: "bg-yellow-100", text: "text-yellow-700", icon: "text-yellow-700" },
  MCX: { bg: "bg-purple-100", text: "text-purple-600", icon: "text-purple-600" },
  NCEDX: { bg: "bg-red-100", text: "text-red-600", icon: "text-red-600" },
}

function SegmentBlocks({
  title,
  subtitle,
  seg,
  adminValue,
  masterValue,
  percentage,
}: SegmentBlocksProps) {
  const symbol = percentage ? "%" : "₹"

  const color = segmentColorMap[seg] || { bg: "bg-gray-100", text: "text-gray-600" }

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
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <span className={`rounded-full ${color.bg} ${color.text} text-xs font-medium px-3 py-1`}>
            {seg}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label className="text-sm text-foreground">Admin Value</Label>
            <div className="mt-1 h-10 flex items-center rounded-md border border-border bg-background/20 px-3 text-muted-foreground font-medium">
              {symbol} {adminValue}
            </div>
          </div>

          <div>
            <Label className="text-sm text-foreground">Master Value</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {symbol}
              </span>
              <Input
                defaultValue={masterValue}
                className="pl-7 h-10 bg-background border border-border text-foreground rounded-md font-medium"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm text-foreground">Total Value</Label>
            <div className="mt-1 h-10 flex items-center rounded-md border border-border bg-background/20 px-3 text-muted-foreground font-medium">
              {symbol} {adminValue + masterValue}
            </div>
          </div>

        </div>
      </div>
    </CardContent>
  )
}

export default SegmentBlocks
