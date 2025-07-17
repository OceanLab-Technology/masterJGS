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
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TrendingUp, TrendingDown, Target, BarChart3, Users, X } from "lucide-react";
import { usePositionStore } from "@/store/usePositionStore";

export default function PositionsPage() {
  const navigate = useNavigate();
  const { detailedPositions, loading, fetchDetailedPositions } = usePositionStore();
  const [searchInput, setSearchInput] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [scriptFilter, setScriptFilter] = useState("All");
  const [clientFilter, setClientFilter] = useState("All");
  const [segmentFilter, setSegmentFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(20); // Start with 20 items
  const itemsPerLoad = 20; // Load 20 more each time

  useEffect(() => {
    fetchDetailedPositions();
  }, [fetchDetailedPositions]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchFilter(searchInput);
      setVisibleCount(20); // Reset visible count on search
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [scriptFilter, clientFilter, segmentFilter, typeFilter]);

  const filteredPositions = detailedPositions.filter((position) => {
    const matchesSearch = 
      position.script.toLowerCase().includes(searchFilter.toLowerCase()) ||
      position.nickname.toLowerCase().includes(searchFilter.toLowerCase()) ||
      position.clientId.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesScript = scriptFilter === "All" || position.script === scriptFilter;
    const matchesClient = clientFilter === "All" || position.nickname === clientFilter;
    const matchesSegment = segmentFilter === "All" || position.segment === segmentFilter;
    const matchesType = typeFilter === "All" || position.type === typeFilter;
    
    return matchesSearch && matchesScript && matchesClient && matchesSegment && matchesType;
  });

  // Get visible positions for infinite scroll
  const visiblePositions = filteredPositions.slice(0, visibleCount);
  const hasMoreData = visibleCount < filteredPositions.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + itemsPerLoad, filteredPositions.length));
  };

  // Get unique values for dropdowns
  const uniqueScripts = [...new Set(detailedPositions.map(p => p.script))];
  const uniqueClients = [...new Set(detailedPositions.map(p => p.nickname))];

  // Calculate summary
  const summary = {
    totalPositions: filteredPositions.length,
    totalValue: filteredPositions.reduce((sum, pos) => sum + pos.value, 0),
    totalPnl: filteredPositions.reduce((sum, pos) => sum + pos.pnl, 0),
    totalPnlPercentage: filteredPositions.length > 0 
      ? (filteredPositions.reduce((sum, pos) => sum + pos.pnlPercentage, 0) / filteredPositions.length)
      : 0
  };

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

  const clearAllFilters = () => {
    setSearchInput("");
    setSearchFilter("");
    setScriptFilter("All");
    setClientFilter("All");
    setSegmentFilter("All");
    setTypeFilter("All");
    setVisibleCount(20);
  };

  const handleRowClick = (clientId: string) => {
    navigate(`/client/${clientId}`);
  };

  return (
    <DashboardLayout title="All Positions">
      <div className="flex flex-col space-y-6 p-6">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/positions-dashboard">Position Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>All Positions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalPositions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <span className="text-lg text-muted-foreground">₹</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold flex items-center gap-2 ${getPnlColor(summary.totalPnl)}`}>
                {formatCurrency(summary.totalPnl)}
                {getPnlIcon(summary.totalPnl)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg P&L %</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold flex items-center gap-2 ${getPnlColor(summary.totalPnlPercentage)}`}>
                {formatPercentage(summary.totalPnlPercentage)}
                {getPnlIcon(summary.totalPnlPercentage)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filtering */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Advanced Filters</CardTitle>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Input
              className="col-span-2"
                placeholder="Search script/client/ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />

              <Select value={scriptFilter} onValueChange={setScriptFilter}>
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Script" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Scripts</SelectItem>
                  {uniqueScripts.map(script => (
                    <SelectItem key={script} value={script}>{script}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Clients</SelectItem>
                  {uniqueClients.map(client => (
                    <SelectItem key={client} value={client}>{client}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Segments</SelectItem>
                  <SelectItem value="Equity">Equity</SelectItem>
                  <SelectItem value="Futures">Futures</SelectItem>
                  <SelectItem value="Options">Options</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="BUY">BUY</SelectItem>
                  <SelectItem value="SELL">SELL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Positions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Detailed Positions 
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (Showing {visiblePositions.length} of {filteredPositions.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Script</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>P&L %</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8">
                        Loading positions...
                      </TableCell>
                    </TableRow>
                  ) : visiblePositions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8">
                        No positions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    visiblePositions.map((position) => (
                      <TableRow 
                        key={position.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(position.clientId)}
                      >
                        <TableCell>
                          <div className="font-medium">{position.nickname}</div>
                          <div className="text-xs text-muted-foreground">{position.clientId}</div>
                        </TableCell>
                        <TableCell className="font-medium">{position.script}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{position.segment}</Badge>
                          {position.expiry && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Exp: {new Date(position.expiry).toLocaleDateString('en-GB')}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={position.type === 'BUY' ? 'default' : 'secondary'}>
                            {position.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{position.qty}</TableCell>
                        <TableCell>{formatCurrency(position.price)}</TableCell>
                        <TableCell>{formatCurrency(position.value)}</TableCell>
                        <TableCell>{formatCurrency(position.currentPrice)}</TableCell>
                        <TableCell className={getPnlColor(position.pnl)}>
                          {formatCurrency(position.pnl)}
                        </TableCell>
                        <TableCell className={`flex items-center gap-1 ${getPnlColor(position.pnl)}`}>
                          {formatPercentage(position.pnlPercentage)}
                          {getPnlIcon(position.pnl)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(position.timestamp).toLocaleDateString('en-GB')} {new Date(position.timestamp).toLocaleTimeString('en-GB')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  
                  {/* Load More Row */}
                  {hasMoreData && !loading && (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-4 border-t">
                        <Button 
                          variant="outline" 
                          onClick={loadMore}
                          className="w-full max-w-xs"
                        >
                          Load More
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}