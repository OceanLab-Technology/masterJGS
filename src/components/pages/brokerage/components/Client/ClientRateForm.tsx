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
  clientId: z.string().min(1, "Client ID is required"),
  clientName: z.string().min(1, "Client name is required"),
  applicationType: z.enum(["global", "segment", "script"]),
  segment: z.string().optional(),
  scriptName: z.string().optional(),
  brokerageType: z.enum(["percentage", "amount"]),
  adminValue: z.coerce.number().min(0, "Admin value must be non-negative"),
  masterValue: z.coerce.number().min(0, "Master value must be non-negative"),
});

export type ClientBrokerage = {
  id: string;
  clientId: string;
  clientName: string;
  applicationType: "global" | "segment" | "script";
  segment?: string;
  scriptName?: string;
  brokerageType: "percentage" | "amount";
  adminValue: number;
  masterValue: number;
};

type ClientRateFormData = z.infer<typeof formSchema>;

interface ClientRateFormProps {
  onSubmit: (data: ClientRateFormData) => void;
  initialData?: Partial<ClientBrokerage>;
  onCancel: () => void;
}

export const ClientRateForm: React.FC<ClientRateFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  const form = useForm<ClientRateFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: initialData?.clientId || "",
      clientName: initialData?.clientName || "",
      applicationType: initialData?.applicationType || "global",
      segment: initialData?.segment || "",
      scriptName: initialData?.scriptName || "",
      brokerageType: initialData?.brokerageType || "percentage",
      adminValue: initialData?.adminValue || 0,
      masterValue: initialData?.masterValue || 0,
    },
  });

  const segments = ["NSE", "FUT", "OPT", "MCX", "NCDEX"];

  const applicationType = form.watch("applicationType");

  function processSubmit(data: ClientRateFormData) {
    onSubmit(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(processSubmit)}
        className="space-y-6 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. CL001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <FormField
            control={form.control}
            name="applicationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select application type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="global">
                      Global (All segments & scripts)
                    </SelectItem>
                    <SelectItem value="segment">Specific Segment</SelectItem>
                    <SelectItem value="script">Specific Script</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brokerageType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brokerage Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage %</SelectItem>
                    <SelectItem value="amount">Amount ₹</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {applicationType === "segment" && (
          <FormField
            control={form.control}
            name="segment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Segment</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select segment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {segments.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {applicationType === "script" && (
          <FormField
            control={form.control}
            name="scriptName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Script Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. RELIANCE" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <FormField
            control={form.control}
            name="adminValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 0.35 or 25.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="masterValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Master Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 0.20 or 15.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData?.clientId ? "Update Rate" : "Add Rate"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
