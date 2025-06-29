"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BrokerageForm } from './BrokerageForm.tsx';
import { Pencil, Trash2, Search, Crown } from 'lucide-react';

interface ClientBrokerage {
  id: string;
  clientId: string;
  clientName: string;
  segment?: string;
  scriptName?: string;
  adminValue: string;
  masterValue: string;
  brokerageType: 'percentage' | 'amount';
  applicationType: 'global' | 'segment' | 'script';
}

export default function ClientBrokerageSettings() {
  const [clientSettings, setClientSettings] = useState<ClientBrokerage[]>([{
    id: '1', clientId: 'CL001', clientName: 'John Doe', adminValue: '0.30', masterValue: '0.18', brokerageType: 'percentage', applicationType: 'global'
  }, {
    id: '2', clientId: 'CL002', clientName: 'Jane Smith', segment: 'FUT', adminValue: '20.00', masterValue: '10.00', brokerageType: 'amount', applicationType: 'segment'
  }, {
    id: '3', clientId: 'CL001', clientName: 'John Doe', scriptName: 'RELIANCE', adminValue: '0.25', masterValue: '0.15', brokerageType: 'percentage', applicationType: 'script'
  }]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientBrokerage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    clientId: '', clientName: '', segment: '', scriptName: '', adminValue: '', masterValue: '', brokerageType: 'percentage', applicationType: 'global'
  });

  const segments = ['NSE', 'FUT', 'OPT', 'MCX', 'NCDEX'];

  const filteredSettings = clientSettings.filter(s =>
    s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.clientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotal = (a: string, m: string) => (parseFloat(a) + parseFloat(m) || 0).toFixed(2);

  const getApplicationBadge = (s: ClientBrokerage) => {
    const base = 'text-white text-xs';
    switch (s.applicationType) {
      case 'global': return <Badge className={`bg-red-600 ${base}`}>Global Override</Badge>;
      case 'segment': return <Badge className={`bg-orange-600 ${base}`}>Segment: {s.segment}</Badge>;
      case 'script': return <Badge className={`bg-green-600 ${base}`}>Script: {s.scriptName}</Badge>;
      default: return null;
    }
  };

  const handleEdit = (s: ClientBrokerage) => {
    setEditingClient(s);
    setFormData({
      clientId: s.clientId,
      clientName: s.clientName,
      segment: s.segment || '',
      scriptName: s.scriptName || '',
      adminValue: s.adminValue,
      masterValue: s.masterValue,
      brokerageType: s.brokerageType,
      applicationType: s.applicationType
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const updatedData: ClientBrokerage = {
      ...formData,
      id: editingClient ? editingClient.id : Date.now().toString(),
      brokerageType: formData.brokerageType as 'percentage' | 'amount',
      applicationType: formData.applicationType as 'global' | 'segment' | 'script',
    };

    setClientSettings(prev =>
      editingClient
        ? prev.map(s => s.id === editingClient.id ? updatedData : s) // update existing
        : [...prev, updatedData] // add new
    );

    setIsDialogOpen(false);
    setEditingClient(null);
    setFormData({
      clientId: '',
      clientName: '',
      segment: '',
      scriptName: '',
      adminValue: '',
      masterValue: '',
      brokerageType: 'percentage',
      applicationType: 'global',
    });
  };


  const handleDelete = (id: string) => setClientSettings(prev => prev.filter(s => s.id !== id));

  return (
    <div className="space-y-6">
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
                setFormData({
                  clientId: '', clientName: '', segment: '', scriptName: '', adminValue: '', masterValue: '', brokerageType: 'percentage', applicationType: 'global'
                });
              }}
              className="bg-indigo-600 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Add Client Rate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{editingClient ? 'Edit Client Brokerage' : 'Add Client Brokerage'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client-id">Client ID</Label>
                  <Input id="client-id" value={formData.clientId} onChange={(e) => setFormData(p => ({ ...p, clientId: e.target.value }))} placeholder="CL001" />
                </div>
                <div>
                  <Label htmlFor="client-name">Client Name</Label>
                  <Input id="client-name" value={formData.clientName} onChange={(e) => setFormData(p => ({ ...p, clientName: e.target.value }))} placeholder="John Doe" />
                </div>
              </div>

              <div>
                <Label htmlFor="application-type">Application Type</Label>
                <Select value={formData.applicationType} onValueChange={(v) => setFormData(p => ({ ...p, applicationType: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select application type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global (All segments & scripts)</SelectItem>
                    <SelectItem value="segment">Specific Segment</SelectItem>
                    <SelectItem value="script">Specific Script</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.applicationType === 'segment' && (
                <div>
                  <Label htmlFor="segment">Segment</Label>
                  <Select value={formData.segment} onValueChange={(v) => setFormData(p => ({ ...p, segment: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select segment" /></SelectTrigger>
                    <SelectContent>
                      {segments.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.applicationType === 'script' && (
                <div>
                  <Label htmlFor="script-name">Script Name</Label>
                  <Input id="script-name" value={formData.scriptName} onChange={(e) => setFormData(p => ({ ...p, scriptName: e.target.value }))} placeholder="RELIANCE" />
                </div>
              )}

              <BrokerageForm
                adminValue={formData.adminValue}
                masterValue={formData.masterValue}
                brokerageType={formData.brokerageType}
                onMasterChange={(v) => setFormData(p => ({ ...p, masterValue: v }))}
                onTypeChange={(t) => setFormData(p => ({ ...p, brokerageType: t }))}
                adminReadonly={false}
                onAdminChange={(v) => setFormData(p => ({ ...p, adminValue: v }))}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} className="bg-indigo-600 text-white">
                {editingClient ? 'Update' : 'Add'} Client Rate
              </Button>
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
              <TableRow key={s.id} className="border-l-4 border-l-indigo-500">
                <TableCell className="font-medium">{s.clientId}</TableCell>
                <TableCell>{s.clientName}</TableCell>
                <TableCell>{getApplicationBadge(s)}</TableCell>
                <TableCell>{s.adminValue} {s.brokerageType === 'percentage' ? '%' : '₹'}</TableCell>
                <TableCell>{s.masterValue} {s.brokerageType === 'percentage' ? '%' : '₹'}</TableCell>
                <TableCell className="font-medium text-indigo-600">
                  {calculateTotal(s.adminValue, s.masterValue)} {s.brokerageType === 'percentage' ? '%' : '₹'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(s)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(s.id)} >
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
};