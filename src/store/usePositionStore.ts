import { create } from "zustand";
import axios from "axios";

export interface Position {
  id: string;
  script: string;
  segment: string;
  expiry?: string;
  qty: number;
  price: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
}

export interface DetailedPosition {
  id: string;
  clientId: string;
  nickname: string;
  script: string;
  segment: string;
  expiry?: string;
  type: 'BUY' | 'SELL';
  qty: number;
  price: number;
  value: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
  timestamp: string;
}

export interface ClientPosition {
  id: string;
  clientId: string;
  nickname: string;
  netPrice: number;
  qty: number;
  value: number;
}

export interface Trade {
  id: string;
  type: 'BUY' | 'SELL';
  timestamp: string;
  qty: number;
  price: number;
  value: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalPnl: number;
  totalPnlPercentage: number;
  totalPositions: number;
}

interface PositionState {
  positions: Position[];
  detailedPositions: DetailedPosition[];
  clientPositions: ClientPosition[];
  trades: Trade[];
  portfolioSummary: PortfolioSummary;
  loading: boolean;
  error: string | null;
  
  fetchPositions: () => Promise<void>;
  fetchDetailedPositions: () => Promise<void>;
  fetchStockPositions: (stockId: string) => Promise<void>;
  fetchClientTrades: (clientId: string) => Promise<void>;
  closePosition: (positionId: string) => Promise<void>;
  squareOffPositions: (positionIds: string[]) => Promise<void>;
}

const mockPositions: Position[] = [
  {
    id: "P001",
    script: "RELIANCE",
    segment: "Equity",
    qty: 100,
    price: 2450.50,
    currentPrice: 2465.75,
    pnl: 1525.00,
    pnlPercentage: 0.62
  },
  {
    id: "P002", 
    script: "TCS",
    segment: "Equity",
    qty: 50,
    price: 3890.25,
    currentPrice: 3875.00,
    pnl: -762.50,
    pnlPercentage: -0.39
  },
  {
    id: "P003",
    script: "RELIANCE",
    segment: "Futures",
    expiry: "2024-03-28",
    qty: 250,
    price: 2440.00,
    currentPrice: 2465.75,
    pnl: 6437.50,
    pnlPercentage: 1.05
  },
  {
    id: "P004",
    script: "NIFTY",
    segment: "Options",
    expiry: "2024-03-21",
    qty: 75,
    price: 18450.50,
    currentPrice: 18520.25,
    pnl: 5231.25,
    pnlPercentage: 0.38
  },
  {
    id: "P005",
    script: "INFY",
    segment: "Equity",
    qty: 80,
    price: 1485.75,
    currentPrice: 1475.25,
    pnl: -840.00,
    pnlPercentage: -0.71
  }
];

const mockDetailedPositions: DetailedPosition[] = [
  {
    id: "DP001",
    clientId: "C001",
    nickname: "john_doe",
    script: "RELIANCE",
    segment: "Equity",
    type: "BUY",
    qty: 100,
    price: 2450.50,
    value: 245050,
    currentPrice: 2465.75,
    pnl: 1525.00,
    pnlPercentage: 0.62,
    timestamp: "2024-03-15T09:30:00Z"
  },
  {
    id: "DP002",
    clientId: "C002",
    nickname: "jane_smith",
    script: "TCS",
    segment: "Equity", 
    type: "BUY",
    qty: 50,
    price: 3890.25,
    value: 194512.50,
    currentPrice: 3875.00,
    pnl: -762.50,
    pnlPercentage: -0.39,
    timestamp: "2024-03-15T10:15:00Z"
  },
  {
    id: "DP003",
    clientId: "C001",
    nickname: "john_doe",
    script: "RELIANCE",
    segment: "Futures",
    expiry: "2024-03-28",
    type: "BUY",
    qty: 250,
    price: 2440.00,
    value: 610000,
    currentPrice: 2465.75,
    pnl: 6437.50,
    pnlPercentage: 1.05,
    timestamp: "2024-03-15T11:20:00Z"
  },
  {
    id: "DP004",
    clientId: "C003",
    nickname: "mike_wilson",
    script: "NIFTY",
    segment: "Options",
    expiry: "2024-03-21",
    type: "SELL",
    qty: 75,
    price: 18450.50,
    value: 1383787.50,
    currentPrice: 18520.25,
    pnl: 5231.25,
    pnlPercentage: 0.38,
    timestamp: "2024-03-15T12:45:00Z"
  }
];

const mockClientPositions: ClientPosition[] = [
  {
    id: "CP001",
    clientId: "C001",
    nickname: "john_doe",
    netPrice: 2445.25,
    qty: 350,
    value: 855837.50
  },
  {
    id: "CP002", 
    clientId: "C002",
    nickname: "jane_smith",
    netPrice: 3890.25,
    qty: 50,
    value: 194512.50
  },
  {
    id: "CP003",
    clientId: "C003",
    nickname: "mike_wilson",
    netPrice: 18450.50,
    qty: 75,
    value: 1383787.50
  }
];

const mockTrades: Trade[] = [
  {
    id: "T001",
    type: "BUY",
    timestamp: "2024-03-15T09:30:00Z",
    qty: 100,
    price: 2450.50,
    value: 245050
  },
  {
    id: "T002",
    type: "BUY", 
    timestamp: "2024-03-15T11:20:00Z",
    qty: 250,
    price: 2440.00,
    value: 610000
  },
  {
    id: "T003",
    type: "SELL",
    timestamp: "2024-03-14T14:15:00Z",
    qty: 50,
    price: 2455.75,
    value: 122787.50
  }
];

export const usePositionStore = create<PositionState>((set, get) => ({
  positions: [],
  detailedPositions: [],
  clientPositions: [],
  trades: [],
  portfolioSummary: {
    totalValue: 0,
    totalPnl: 0,
    totalPnlPercentage: 0,
    totalPositions: 0
  },
  loading: false,
  error: null,

  fetchPositions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get<Position[]>("/api/positions");
      const portfolioSummary = calculatePortfolioSummary(res.data);
      set({ positions: res.data, portfolioSummary, loading: false });
    } catch (err) {
      console.error("API failed:", err);
      const portfolioSummary = calculatePortfolioSummary(mockPositions);
      set({ positions: mockPositions, portfolioSummary, loading: false });
    }
  },

  fetchDetailedPositions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get<DetailedPosition[]>("/api/positions/detailed");
      set({ detailedPositions: res.data, loading: false });
    } catch (err) {
      console.error("API failed:", err);
      set({ detailedPositions: mockDetailedPositions, loading: false });
    }
  },

  fetchStockPositions: async (stockId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get<ClientPosition[]>(`/api/positions/stock/${stockId}`);
      set({ clientPositions: res.data, loading: false });
    } catch (err) {
      console.error("API failed:", err);
      set({ clientPositions: mockClientPositions, loading: false });
    }
  },

  fetchClientTrades: async (clientId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get<Trade[]>(`/api/clients/${clientId}/trades`);
      set({ trades: res.data, loading: false });
    } catch (err) {
      console.error("API failed:", err);
      set({ trades: mockTrades, loading: false });
    }
  },

  closePosition: async (positionId: string) => {
    try {
      await axios.post(`/api/positions/${positionId}/close`);
      get().fetchPositions();
    } catch (err) {
      console.error("Close position failed:", err);
      throw new Error("Failed to close position");
    }
  },

  squareOffPositions: async (positionIds: string[]) => {
    try {
      await axios.post("/api/positions/square-off", { positionIds });
      get().fetchPositions();
    } catch (err) {
      console.error("Square off failed:", err);
      throw new Error("Failed to square off positions");
    }
  },
}));

function calculatePortfolioSummary(positions: Position[]): PortfolioSummary {
    if (positions.length === 0) {
      return {
        totalValue: 0,
        totalPnl: 0,
        totalPnlPercentage: 0,
        totalPositions: 0
      };
    }
  
    const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0);
    const totalValue = positions.reduce((sum, pos) => sum + Math.abs(pos.qty * pos.currentPrice), 0);
    
    const totalInvestmentValue = positions.reduce((sum, pos) => sum + Math.abs(pos.qty * pos.price), 0);
    const totalPnlPercentage = totalInvestmentValue > 0 ? (totalPnl / totalInvestmentValue) * 100 : 0;
  
    return {
      totalValue,
      totalPnl,
      totalPnlPercentage,
      totalPositions: positions.length
    };
  }