import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, TrendingUp, TrendingDown, Hash } from "lucide-react";
import { usePositionStore } from "@/store/usePositionStore";
import { useState } from "react";

export default function ClientTrades() {
  const { id: clientId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trades, loading, fetchClientTrades } = usePositionStore();
  const [visibleCount, setVisibleCount] = useState(25); // Start with 25 trades
  const itemsPerLoad = 25; // Load 25 more each time

  useEffect(() => {
    if (clientId) {
      fetchClientTrades(clientId);
    }
  }, [clientId, fetchClientTrades]);

  // Get visible trades for infinite scroll
  const visibleTrades = trades.slice(0, visibleCount);
  const hasMoreData = visibleCount < trades.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + itemsPerLoad, trades.length));
  };

  // Calculate summary
  const summary = {
    buyQty: trades.filter(t => t.type === 'BUY').reduce((sum, t) => sum + t.qty, 0),
    sellQty: trades.filter(t => t.type === 'SELL').reduce((sum, t) => sum + t.qty, 0),
    netQty: trades.reduce((sum, t) => sum + (t.type === 'BUY' ? t.qty : -t.qty), 0),
    avgPrice: trades.length > 0 
      ? trades.reduce((sum, t) => sum + t.price, 0) / trades.length
      : 0,
    totalTrades: trades.length,
    totalBuyValue: trades.filter(t => t.type === 'BUY').reduce((sum, t) => sum + t.value, 0),
    totalSellValue: trades.filter(t => t.type === 'SELL').reduce((sum, t) => sum + t.value, 0)
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout title={`Client Trades - ${clientId}`}>
      <div className="flex flex-col space-y-6 p-6">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/positions-dashboard">Position Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Client {clientId} Trades</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Client {clientId} - Trade History</h1>
        </div>

        {/* Client Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Buy Qty</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.buyQty}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sell Qty</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{summary.sellQty}</div>
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
              <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
              <span className="text-lg text-muted-foreground">₹</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.avgPrice)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Trade History Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Trade History 
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (Showing {visibleTrades.length} of {trades.length} trades)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <div className="overflow-auto max-h-[600px] border rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead className="min-w-[160px]">Date & Time</TableHead>
                      <TableHead className="min-w-[120px]">Transaction Type</TableHead>
                      <TableHead className="min-w-[80px]">Quantity</TableHead>
                      <TableHead className="min-w-[100px]">Price</TableHead>
                      <TableHead className="min-w-[120px]">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Loading trades...
                        </TableCell>
                      </TableRow>
                    ) : visibleTrades.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No trades found for client {clientId}
                        </TableCell>
                      </TableRow>
                    ) : (
                      visibleTrades.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="font-medium">
                            {new Date(trade.timestamp).toLocaleDateString('en-GB')} {new Date(trade.timestamp).toLocaleTimeString('en-GB')}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={trade.type === 'BUY' ? 'default' : 'destructive'}
                              className={trade.type === 'BUY' ? 'bg-green-600' : 'bg-red-600'}
                            >
                              {trade.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{trade.qty}</TableCell>
                          <TableCell>{formatCurrency(trade.price)}</TableCell>
                          <TableCell className={trade.type === 'BUY' ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(trade.value)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    
                    {/* Load More Row */}
                    {hasMoreData && !loading && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 border-t">
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
            </div>
          </CardContent>
        </Card>

        {/* Summary Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalTrades}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Buy Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.totalBuyValue)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sell Value</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.totalSellValue)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}