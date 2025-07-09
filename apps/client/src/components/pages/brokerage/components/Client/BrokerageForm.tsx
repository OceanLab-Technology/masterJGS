import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/select';
import { Badge } from '@repo/ui/components/badge';
import { Lock } from '@repo/ui/icons';
interface BrokerageFormProps {
  adminValue: string;
  masterValue: string;
  brokerageType: string;
  onAdminChange?: (value: string) => void;
  onMasterChange: (value: string) => void;
  onTypeChange: (type: 'percentage' | 'amount') => void;
  adminReadonly?: boolean;
  showTotal?: boolean;
}

export const BrokerageForm = ({
  adminValue,
  masterValue,
  brokerageType,
  onAdminChange,
  onMasterChange,
  onTypeChange,
  adminReadonly = false,
  showTotal = true
}: BrokerageFormProps) => {
  const calculateTotal = () => {
    const admin = parseFloat(adminValue) || 0;
    const master = parseFloat(masterValue) || 0;
    return (admin + master).toFixed(2);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <Label className="text-sm font-medium">Brokerage Type:</Label>
        <Select value={brokerageType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentage (%)</SelectItem>
            <SelectItem value="amount">Amount (₹)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Admin Value
            {adminReadonly && <Lock className="w-3 h-3 text-gray-400" />}
            {adminReadonly && <Badge variant="outline" className="text-xs">Read Only</Badge>}
          </Label>
          <Input
            value={adminValue}
            onChange={(e) => onAdminChange?.(e.target.value)}
            placeholder={brokerageType === 'percentage' ? '0.50' : '10.00'}
            readOnly={adminReadonly}
            className={adminReadonly ? 'bg-gray-50 cursor-not-allowed' : ''}
          />
          <p className="text-xs text-gray-500">
            {brokerageType === 'percentage' ? 'Percentage of transaction' : 'Fixed amount per transaction'}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Master Value</Label>
          <Input
            value={masterValue}
            onChange={(e) => onMasterChange(e.target.value)}
            placeholder={brokerageType === 'percentage' ? '0.30' : '5.00'}
          />
          <p className="text-xs text-gray-500">
            {brokerageType === 'percentage' ? 'Additional percentage' : 'Additional fixed amount'}
          </p>
        </div>

        {showTotal && (
          <div className="space-y-2">
            <Label>Total Value</Label>
            <div className="relative">
              <Input
                value={calculateTotal()}
                readOnly
                className="bg-blue-50 border-blue-200 text-blue-800 font-medium"
              />
              <Badge className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600">
                Admin + Master
              </Badge>
            </div>
            <p className="text-xs text-gray-500">
              Automatically calculated total brokerage
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
