import { create } from "zustand";
import axios from "axios";

export interface Segment {
  id: number;
  title: string;
  admin_value: number;
  master_value: number;
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

export const useSegmentStore = create<SegmentState>((set) => ({
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
