"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, Crown, Pencil, Search, Trash2, X } from "lucide-react";
import { ClientRateForm, type ClientBrokerage } from "./ClientRateForm";
import { IconPlus } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";

export default function ClientBrokerageSettings() {
  const [clientSettings, setClientSettings] = useState<ClientBrokerage[]>([
    {
      id: "1",
      clientId: "CL001",
      clientName: "John Doe",
      adminValue: 0.3,
      masterValue: 0.18,
      brokerageType: "percentage",
      applicationType: "global",
    },
    {
      id: "2",
      clientId: "CL002",
      clientName: "Jane Smith",
      segment: "FUT",
      adminValue: 20.0,
      masterValue: 10.0,
      brokerageType: "amount",
      applicationType: "segment",
    },
    {
      id: "3",
      clientId: "CL001",
      clientName: "John Doe",
      scriptName: "RELIANCE",
      adminValue: 0.25,
      masterValue: 0.15,
      brokerageType: "percentage",
      applicationType: "script",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientBrokerage | null>(
    null
  );

  const filteredSettings = clientSettings.filter(
    (s) =>
      s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.clientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotal = (a: number, m: number) => (a + m || 0).toFixed(2);

  const getApplicationBadge = (s: ClientBrokerage) => {
    const base = "text-white text-xs";
    switch (s.applicationType) {
      case "global":
        return <Badge className={`bg-red-600 ${base}`}>Global Override</Badge>;
      case "segment":
        return (
          <Badge className={`bg-orange-600 ${base}`}>
            Segment: {s.segment}
          </Badge>
        );
      case "script":
        return (
          <Badge className={`bg-green-600 ${base}`}>
            Script: {s.scriptName}
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleEdit = (s: ClientBrokerage) => {
    setEditingClient(s);
    setIsDialogOpen(true);
  };

  const handleSave = (formData: Omit<ClientBrokerage, "id">) => {
    if (editingClient) {
      const updatedData: ClientBrokerage = {
        ...formData,
        id: editingClient.id,
      };
      setClientSettings((prev) =>
        prev.map((s) => (s.id === editingClient.id ? updatedData : s))
      );
    } else {
      const newId = Date.now().toString();
      const newData: ClientBrokerage = {
        ...formData,
        id: newId,
      };
      setClientSettings((prev) => [...prev, newData]);
    }
    setIsDialogOpen(false);
    setEditingClient(null);
  };

  const handleDelete = (id: string) =>
    setClientSettings((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingClient(null);
                setIsDialogOpen(true);
              }}
              className=""
            >
              <IconPlus className="w- h- " />
              Add Client Rate
            </Button>
          </DialogTrigger>

          <DialogContent className="script-rates-dialog sm:max-w-xl p-0 rounded-lg shadow-xl">
            <div>
              <DialogHeader className="">
                <div className="flex items-center justify-between space-x-4  p-6 md:p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-muted p-3 rounded-lg flex-shrink-0 mt-1">
                      <Building2 className="h-7 w-7 " />
                    </div>
                    <div>
                      <DialogTitle className="text-lg font-semibold ">
                        {editingClient ? "Edit" : "Add"} Script Rate
                      </DialogTitle>
                      <DialogDescription className="text-sm text-gray-500 mt-1">
                        {editingClient
                          ? "Update the details for the script rate."
                          : "Fill the data for the new script rate."}
                      </DialogDescription>
                    </div>
                  </div>
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      className="h-9 w-9 p-0 rounded-full border  flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 self-center"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5 " />
                    </Button>
                  </DialogClose>
                </div>
                <Separator className="mb-6" />
              </DialogHeader>
              <ClientRateForm
                onSubmit={handleSave}
                initialData={editingClient || undefined}
                onCancel={() => setIsDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-900">
              <TableHead>Client ID</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Application</TableHead>
              <TableHead>Admin Value</TableHead>
              <TableHead>Master Value</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSettings.map((s) => (
              <TableRow key={s.id} className="border-l-4 border-l-primary">
                <TableCell className="font-medium">{s.clientId}</TableCell>
                <TableCell>{s.clientName}</TableCell>
                <TableCell>{getApplicationBadge(s)}</TableCell>
                <TableCell>
                  {s.adminValue} {s.brokerageType === "percentage" ? "%" : "₹"}
                </TableCell>
                <TableCell>
                  {s.masterValue} {s.brokerageType === "percentage" ? "%" : "₹"}
                </TableCell>
                <TableCell className="font-medium text-orange-500">
                  {calculateTotal(s.adminValue, s.masterValue)}{" "}
                  {s.brokerageType === "percentage" ? "%" : "₹"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(s)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(s.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
