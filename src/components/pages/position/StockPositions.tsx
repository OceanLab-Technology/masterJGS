import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ArrowLeft, MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import { usePositionStore } from "@/store/usePositionStore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function StockPositions() {
  const { id: stockId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clientPositions, loading, fetchStockPositions, closePosition, squareOffPositions } = usePositionStore();
  const [clientInput, setClientInput] = useState("");
  const [clientFilter, setClientFilter] = useState("All");
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(15); // Start with 15 items
  const itemsPerLoad = 15; // Load 15 more each time

  useEffect(() => {
    if (stockId) {
      fetchStockPositions(stockId);
    }
  }, [stockId, fetchStockPositions]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setClientFilter(clientInput || "All");
      setVisibleCount(15); // Reset visible count on search
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [clientInput]);

  const filteredPositions = clientPositions.filter(position => 
    clientFilter === "All" || position.nickname.toLowerCase().includes(clientFilter.toLowerCase())
  );

  // Get visible positions for infinite scroll
  const visiblePositions = filteredPositions.slice(0, visibleCount);
  const hasMoreData = visibleCount < filteredPositions.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + itemsPerLoad, filteredPositions.length));
  };

  // Calculate summary
  const summary = {
    totalBuyQty: filteredPositions.reduce((sum, pos) => sum + Math.max(0, pos.qty), 0),
    totalSellQty: filteredPositions.reduce((sum, pos) => sum + Math.max(0, -pos.qty), 0),
    netQty: filteredPositions.reduce((sum, pos) => sum + pos.qty, 0),
    netAvgPrice: filteredPositions.length > 0 
      ? filteredPositions.reduce((sum, pos) => sum + pos.netPrice, 0) / filteredPositions.length
      : 0
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleClosePosition = async (positionId: string) => {
    try {
      await closePosition(positionId);
      toast.success("Position closed successfully");
    } catch (error) {
      toast.error("Failed to close position");
    }
  };

  const handleSquareOffSelected = async () => {
    if (selectedPositions.length === 0) {
      toast.error("Please select positions to square off");
      return;
    }
    
    try {
      await squareOffPositions(selectedPositions);
      setSelectedPositions([]);
      toast.success("Positions squared off successfully");
    } catch (error) {
      toast.error("Failed to square off positions");
    }
  };

  const handleCloseAllPositions = async () => {
    const allPositionIds = filteredPositions.map(p => p.id);
    try {
      await squareOffPositions(allPositionIds);
      toast.success("All positions closed successfully");
    } catch (error) {
      toast.error("Failed to close all positions");
    }
  };

  const handleRowClick = (clientId: string) => {
    navigate(`/client/${clientId}`);
  };

  const togglePositionSelection = (positionId: string) => {
    setSelectedPositions(prev => 
      prev.includes(positionId) 
        ? prev.filter(id => id !== positionId)
        : [...prev, positionId]
    );
  };

  return (
    <DashboardLayout title={`Stock Positions - ${stockId}`}>
      <div className="flex flex-col space-y-6 p-6">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/positions-dashboard">Position Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{stockId} Positions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/positions-dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">{stockId} Positions</h1>
        </div>

        {/* Stock Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Buy Qty</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.totalBuyQty}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sell Qty</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{summary.totalSellQty}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Qty</CardTitle>
              <Badge variant={summary.netQty >= 0 ? "default" : "destructive"}>
                {summary.netQty >= 0 ? "LONG" : "SHORT"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${summary.netQty >= 0 ? "text-green-600" : "text-red-600"}`}>
                {summary.netQty}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Avg Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.netAvgPrice)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Input
            placeholder="Search clients..."
            value={clientInput}
            onChange={(e) => setClientInput(e.target.value)}
            className="w-[200px]"
          />

          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleCloseAllPositions}
            >
              Close All Positions
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSquareOffSelected}
              disabled={selectedPositions.length === 0}
            >
              Square Off Selected ({selectedPositions.length})
            </Button>
          </div>
        </div>

        {/* Client Positions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Client Positions 
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
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Net Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading positions...
                      </TableCell>
                    </TableRow>
                  ) : visiblePositions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No positions found for {stockId}
                      </TableCell>
                    </TableRow>
                  ) : (
                    visiblePositions.map((position) => (
                      <TableRow key={position.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedPositions.includes(position.id)}
                            onChange={() => togglePositionSelection(position.id)}
                            className="rounded"
                          />
                        </TableCell>
                        <TableCell 
                          className="font-medium cursor-pointer hover:text-blue-600"
                          onClick={() => handleRowClick(position.clientId)}
                        >
                          <div>{position.nickname}</div>
                          <div className="text-xs text-muted-foreground">{position.clientId}</div>
                        </TableCell>
                        <TableCell>{formatCurrency(position.netPrice)}</TableCell>
                        <TableCell>
                          <div className={position.qty >= 0 ? "text-green-600" : "text-red-600"}>
                            {position.qty}
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(position.value)}</TableCell>
                        <TableCell>
                          <Badge variant={position.qty >= 0 ? "default" : "destructive"}>
                            {position.qty >= 0 ? "LONG" : "SHORT"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleClosePosition(position.id)}>
                                Close Position
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRowClick(position.clientId)}>
                                View Client Trades
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  
                  {/* Load More Row */}
                  {hasMoreData && !loading && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 border-t">
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