import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  scriptName: z.string().min(1, "Script name is required"),
  symbol: z.string().min(1, "Symbol is required"),
  segment: z.enum(["BSE", "NSE", "MCX"]),
  type: z.enum(["percentage", "rupee"]),
  adminValue: z.coerce.number().min(0, "Admin value must be non-negative"),
  masterValue: z.coerce.number().min(0, "Master value must be non-negative"),
});

export type ScriptRate = {
  id: string;
  scriptName: string;
  symbol: string;
  segment: "BSE" | "NSE" | "MCX";
  type: "percentage" | "rupee";
  adminValue: number;
  masterValue: number;
  total: number;
};

type ScriptRateFormData = z.infer<typeof formSchema>;

interface ScriptRateFormProps {
  onSubmit: (data: ScriptRateFormData) => void;
  initialData?: Partial<ScriptRate>;
  onCancel: () => void;
}

export const TickerRateForm: React.FC<ScriptRateFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  const form = useForm<ScriptRateFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scriptName: initialData?.scriptName || "",
      symbol: initialData?.symbol || "",
      segment:
        initialData?.segment &&
        ["BSE", "NSE", "MCX"].includes(initialData.segment)
          ? initialData.segment
          : "NSE",
      type:
        initialData?.type && ["percentage", "rupee"].includes(initialData.type)
          ? initialData.type
          : "percentage",
      adminValue: initialData?.adminValue || 0,
      masterValue: initialData?.masterValue || 0,
    },
  });

  function processSubmit(data: ScriptRateFormData) {
    onSubmit(data);
  }

  return (
    <Form {...form}>
      {" "}
      <form
        onSubmit={form.handleSubmit(processSubmit)}
        className="space-y-6 p-6 md:p-6 !pt-0"
      >
        <FormField
          control={form.control}
          name="scriptName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium ">
                Script Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Reliance Industries, NIFTY Future"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium ">Symbol</FormLabel>
              <FormControl>
                <Input placeholder="e.g. RELIANCE, NIFTY50FUT" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <FormField
            control={form.control}
            name="segment"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium ">Segment</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue="NSE"
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select segment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BSE">BSE</SelectItem>
                    <SelectItem value="NSE">NSE</SelectItem>
                    <SelectItem value="MCX">MCX</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium ">Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue="percentage"
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage %</SelectItem>
                    <SelectItem value="rupee">Rupee ₹</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <FormField
            control={form.control}
            name="adminValue"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium ">
                  Admin Value
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 0.35 or 25.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="masterValue"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium ">
                  Master Value
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 0.20 or 15.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3  ">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Rate" : "Submit Rate"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
