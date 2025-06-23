import { CircleDollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
                    {/* Segment Tag */}
                    <div className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1">
                        Segment: Sales
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Segment Block */}
                <div className="rounded-xl border border-border bg-card-foreground/5 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary h-9 w-9">
                                <CircleDollarSign className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-base font-medium text-foreground">Sales</p>
                                <p className="text-xs text-muted-foreground">Revenue Segment</p>
                            </div>
                        </div>
                        <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm text-primary">
                            ₹
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Admin Value */}
                        <div>
                            <Label className="text-sm text-foreground">Admin Value</Label>
                            <div className="mt-1 w-full rounded-md border border-border bg-muted text-muted-foreground px-3 py-2 h-10 flex items-center">
                                ₹ 5,000
                            </div>
                        </div>

                        {/* Master Value */}
                        <div>
                            <Label htmlFor="master-value-sales" className="text-sm text-foreground">Master Value</Label>
                            <div className="relative mt-1 h-10">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                <Input
                                    id="master-value-sales"
                                    defaultValue="10000"
                                    className="pl-7 h-10 bg-input text-foreground border-border rounded-md"
                                />
                            </div>
                        </div>

                        {/* Total Value */}
                        <div>
                            <Label className="text-sm text-foreground">Total Value</Label>
                            <div className="mt-1 w-full rounded-md border border-border bg-card-foreground/10 text-foreground px-3 py-2 h-10 flex items-center">
                                ₹ 15,000
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                <Button className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90">
                    Save Changes
                </Button>
            </CardFooter>
        </Card>
    )
}

export default Segment