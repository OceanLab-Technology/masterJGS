import { create } from "zustand";
import axios from "axios";

export interface Segment {
  id: number;
  title: string;
  admin_value: number;
  master_value: number;
  percentage: boolean;
  is_blocked: boolean;
}

interface SegmentState {
  segments: Segment[];
  loading: boolean;
  error: string | null;
  fetchSegments: () => Promise<void>;
  updateSegmentsBatch: (
    updates: { id: number; master_value: number }[]
  ) => Promise<void>;
  updateSegmentLocally: (id: number, partial: Partial<Segment>) => void;
}

export const useSegmentStore = create<SegmentState>((set, get) => ({
  segments: [],
  loading: false,
  error: null,

  fetchSegments: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get<Segment[]>("/api/brokerage/segment");
      console.log("Fetched segments:", res.data);
      set({ segments: res.data, loading: false });
    } catch (err) {
      console.error("API failed, using dummy data:", err);

      // Fallback to dummy data when API fails
      const dummySegments: Segment[] = [
        {
          id: 1,
          title: "NSE",
          admin_value: 0.4,
          master_value: 0.25,
          percentage: true,
          is_blocked: false,
        },
        {
          id: 2,
          title: "BSE",
          admin_value: 0.35,
          master_value: 0.2,
          percentage: true,
          is_blocked: false,
        },
        {
          id: 3,
          title: "F&O",
          admin_value: 20.0,
          master_value: 15.0,
          percentage: false,
          is_blocked: false,
        },
        {
          id: 4,
          title: "MCX",
          admin_value: 0.3,
          master_value: 0.2,
          percentage: true,
          is_blocked: false,
        },
        {
          id: 5,
          title: "NCDEX",
          admin_value: 0.35,
          master_value: 0.25,
          percentage: true,
          is_blocked: false,
        },
      ];

      set({ segments: dummySegments, loading: false, error: null });
    }
  },

  updateSegmentsBatch: async (
    updates: { id: number; master_value: number }[]
  ) => {
    try {
      const res = await axios.patch<{ updated: Segment[] }>(
        "/api/brokerage/segment",
        updates
      );

      // Replace segments with updated ones
      set((state) => ({
        segments: state.segments.map((seg) => {
          const updated = res.data.updated.find((u) => u.id === seg.id);
          return updated ? updated : seg;
        }),
      }));
    } catch (err) {
      console.error("Batch update failed", err);
    }
  },

  updateSegmentLocally: (id, partial) => {
    set((state) => ({
      segments: state.segments.map((s) =>
        s.id === id ? { ...s, ...partial } : s
      ),
    }));
  },
}));
