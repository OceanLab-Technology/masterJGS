import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { TrendingUp, TrendingDown, Target, BarChart3 } from "lucide-react";
import { usePositionStore } from "@/store/usePositionStore";

export default function PositionDashboard() {
  const navigate = useNavigate();
  const { positions, portfolioSummary, loading, fetchPositions } = usePositionStore();
  const [searchInput, setSearchInput] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("All");

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchFilter(searchInput);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  const filteredPositions = positions.filter((position) => {
    const matchesSearch = position.script.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesSegment = segmentFilter === "All" || position.segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  const getPnlColor = (pnl: number) => {
    return pnl >= 0 ? "text-green-600" : "text-red-600";
  };

  const getPnlIcon = (pnl: number) => {
    return pnl >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const handleRowClick = (script: string) => {
    navigate(`/stock/${script}`);
  };

  return (
    <DashboardLayout title="Position Dashboard">
      <div className="flex flex-col space-y-6 p-6">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Position Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <span className="text-lg text-muted-foreground">₹</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(portfolioSummary.totalValue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total P&L (₹)</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold flex items-center gap-2 ${getPnlColor(portfolioSummary.totalPnl)}`}>
                {formatCurrency(portfolioSummary.totalPnl)}
                {getPnlIcon(portfolioSummary.totalPnl)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total P&L (%)</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold flex items-center gap-2 ${getPnlColor(portfolioSummary.totalPnlPercentage)}`}>
                {formatPercentage(portfolioSummary.totalPnlPercentage)}
                {getPnlIcon(portfolioSummary.totalPnlPercentage)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolioSummary.totalPositions}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter System */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search stocks..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Segments</SelectItem>
              <SelectItem value="Equity">Equity</SelectItem>
              <SelectItem value="Futures">Futures</SelectItem>
              <SelectItem value="Options">Options</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Interactive Positions Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Positions Overview</CardTitle>
            <Button onClick={() => navigate('/positions')}>
              View All Positions
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Script</TableHead>
                      <TableHead className="min-w-[100px]">Segment</TableHead>
                      <TableHead className="min-w-[80px]">Qty</TableHead>
                      <TableHead className="min-w-[100px]">Price</TableHead>
                      <TableHead className="min-w-[120px]">Current Price</TableHead>
                      <TableHead className="min-w-[100px]">P&L</TableHead>
                      <TableHead className="min-w-[100px]">P&L %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading positions...
                        </TableCell>
                      </TableRow>
                    ) : filteredPositions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No positions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPositions.map((position) => (
                        <TableRow 
                          key={position.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(position.script)}
                        >
                          <TableCell className="font-medium">{position.script}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{position.segment}</Badge>
                            {position.expiry && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Exp: {new Date(position.expiry).toLocaleDateString('en-GB')}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{position.qty}</TableCell>
                          <TableCell>{formatCurrency(position.price)}</TableCell>
                          <TableCell>{formatCurrency(position.currentPrice)}</TableCell>
                          <TableCell className={getPnlColor(position.pnl)}>
                            {formatCurrency(position.pnl)}
                          </TableCell>
                          <TableCell className={`flex items-center gap-1 ${getPnlColor(position.pnl)}`}>
                            {formatPercentage(position.pnlPercentage)}
                            {getPnlIcon(position.pnl)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}