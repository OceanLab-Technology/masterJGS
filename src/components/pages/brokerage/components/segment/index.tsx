//   const EmptyState = () => (
//     <div className="flex flex-col items-center justify-center py-16 h-full text-center">
//       <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-muted flex items-center justify-center">
//         <div className="h-12 w-12 rounded-lg bg-muted-foreground/20" />
//       </div>
//       <h3 className="text-lg font-semibold">No segments found</h3>
//       <p className="mt-2 text-sm text-muted-foreground">
//         No segment data is available at the moment. <br />
//         Please check your connection or try again later.
//       </p>
//     </div>
//   );



import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SegmentBlocks from "@/components/pages/brokerage/components/segment/SegmentBlocks";
import { Skeleton } from "@/components/ui/skeleton";
import { create } from "zustand";

// --- Store Setup ---
interface Segment {
  id: number;
  title: string;
  admin_value: number;
  master_value: number;
  is_blocked: boolean;
}

interface SegmentState {
  segments: Segment[];
  setSegments: (segments: Segment[]) => void;
  updateSegmentLocally: (id: number, data: Partial<Segment>) => void;
}

const useSegmentStore = create<SegmentState>((set) => ({
  segments: [],
  setSegments: (segments) => set({ segments }),
  updateSegmentLocally: (id, data) =>
    set((state) => ({
      segments: state.segments.map((s) =>
        s.id === id ? { ...s, ...data } : s
      ),
    })),
}));

// --- Component ---
export default function Segment() {
  const [isLoading, setIsLoading] = useState(true);
  const [dirtySegments, setDirtySegments] = useState<Record<number, number>>({});
  const segments = useSegmentStore((state) => state.segments);
  const setSegments = useSegmentStore((state) => state.setSegments);
  const updateSegmentLocally = useSegmentStore((state) => state.updateSegmentLocally);

  useEffect(() => {
    const loadDummyData = async () => {
      setIsLoading(true);
      await new Promise((res) => setTimeout(res, 100)); // Simulate delay

      const dummySegments: Segment[] = [
        {
          id: 1,
          title: "Equity",
          admin_value: 10,
          master_value: 20,
          is_blocked: false,
        },
        {
          id: 2,
          title: "Futures",
          admin_value: 15,
          master_value: 30,
          is_blocked: false,
        },
        {
          id: 3,
          title: "Options",
          admin_value: 5,
          master_value: 25,
          is_blocked: true,
        },
      ];

      setSegments(dummySegments);
      setIsLoading(false);
    };

    loadDummyData();
  }, [setSegments]);

  const handleUpdateMasterValue = (id: number, value: number) => {
    updateSegmentLocally(id, { master_value: value });
    setDirtySegments((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    // Here we just simulate saving without API
    console.log("Saving segments:", dirtySegments);
    setDirtySegments({});
  };

  const LoadingSkeleton = () => (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-20">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="rounded-lg border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 h-full text-center">
      <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-muted flex items-center justify-center">
        <div className="h-12 w-12 rounded-lg bg-muted-foreground/20" />
      </div>
      <h3 className="text-lg font-semibold">No segments found</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        No segment data is available at the moment. <br />
        Please check your connection or try again later.
      </p>
    </div>
  );

  return (
    <div className="flex flex-col h-full py-4">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <LoadingSkeleton />
        ) : segments.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-20">
            {segments.map((seg) => (
              <SegmentBlocks
                key={seg.id}
                {...seg}
                onUpdateMasterValue={(val) =>
                  handleUpdateMasterValue(seg.id, val)
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {Object.keys(dirtySegments).length > 0 && (
        <div className="flex-shrink-0 sticky bottom-0 z-20 bg-background/95 backdrop-blur-sm border-t px-6 py-4">
          <div className="flex justify-end">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSave}
            >
              Save Changes ({Object.keys(dirtySegments).length})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
