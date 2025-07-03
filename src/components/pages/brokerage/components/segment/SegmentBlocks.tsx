"use client";

import { useState } from "react";
import {
  BarChart3,
  LineChart,
  Clock,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SegmentBlocksProps = {
  id: number;
  title: string;
  admin_value: number;
  master_value: number;
  percentage: boolean;
  is_blocked: boolean;
  onUpdateMasterValue: (val: number) => void;
};

// Define segment configurations
const segmentConfig: Record<
  string,
  {
    icon: React.ElementType;
    color: string;
    type: string;
    description: string;
  }
> = {
  NSE: {
    icon: BarChart3,
    color: "bg-blue-100 text-blue-800",
    type: "Equity",
    description: "National Stock Exchange trading",
  },
  BSE: {
    icon: TrendingUp,
    color: "bg-green-100 text-green-800",
    type: "Equity",
    description: "Bombay Stock Exchange trading",
  },
  "F&O": {
    icon: LineChart,
    color: "bg-purple-100 text-purple-800",
    type: "Derivatives",
    description: "Futures & Options trading",
  },
  MCX: {
    icon: Briefcase,
    color: "bg-amber-100 text-amber-800",
    type: "Commodity",
    description: "Multi Commodity Exchange",
  },
  NCDEX: {
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
    type: "Commodity",
    description: "National Commodity & Derivatives Exchange",
  },
};

function SegmentBlocks({
  id,
  title,
  admin_value,
  master_value,
  percentage,
  is_blocked,
  onUpdateMasterValue,
}: SegmentBlocksProps) {
  const [value, setValue] = useState(master_value);
  const config = segmentConfig[title] || {
    icon: BarChart3,
    color: "bg-gray-100 text-gray-800",
    type: "Other",
    description: "Trading segment",
  };

  const handleBlur = () => {
    if (value !== master_value) {
      onUpdateMasterValue(value);
    }
  };

  const handleAdminValueChange = (newValue: string) => {
    // This would be handled by parent if admin values are editable
    console.log(`Admin value change for ${title}: ${newValue}`);
  };

  const handleMasterValueChange = (newValue: string) => {
    const numValue = Number.parseFloat(newValue) || 0;
    setValue(numValue);
  };

  const calculateTotal = () => {
    return (admin_value + value).toFixed(2);
  };

  const IconComponent = config.icon;

  return (
    <Card className="">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${config.color}`}>
              <IconComponent className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge variant="outline" className={config.color}>
            {config.type}
          </Badge>
        </div>
        {/* <CardDescription>{config.description}</CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor={`brokerage-type-${id}`}
              className="text-sm font-medium"
            >
              Brokerage Type
            </Label>
            <Select defaultValue={percentage ? "Percentage (%)" : "Amount (₹)"}>
              <SelectTrigger id={`brokerage-type-${id}`} className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Percentage (%)">Percentage (%)</SelectItem>
                <SelectItem value="Amount (₹)">Amount (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor={`admin-value-${id}`} className="text-xs">
                Admin Value
              </Label>
              <Input
                id={`admin-value-${id}`}
                value={admin_value.toString()}
                onChange={(e) => handleAdminValueChange(e.target.value)}
                className="mt-1"
                disabled
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`master-value-${id}`} className="text-xs">
                Master Value
              </Label>
              <Input
                id={`master-value-${id}`}
                value={value.toString()}
                onChange={(e) => handleMasterValueChange(e.target.value)}
                onBlur={handleBlur}
                disabled={is_blocked}
                className="mt-1"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Total Value</Label>
              <div className=" flex h-9 py-1 w-full items-center justify-center rounded-md border bg-muted/50 px-3 text-sm">
                <span className="font-medium">{calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SegmentBlocks;
