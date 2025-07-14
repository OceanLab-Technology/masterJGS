import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SegmentBlocks from "@/components/pages/brokerage/components/segment/SegmentBlocks";
import { useSegmentStore } from "@/store/useSegmentStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function Segment() {
  const { segments, fetchSegments, updateSegmentLocally, updateSegmentsBatch } =
    useSegmentStore();
  const [dirtySegments, setDirtySegments] = useState<Record<number, number>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSegments = async () => {
      setIsLoading(true);
      try {
        await fetchSegments();
        console.log("Segments loaded:", segments);
      } catch (error) {
        console.error("Error fetching segments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSegments();
  }, [fetchSegments]);

  useEffect(() => {
    console.log("Current segments state:", segments);
  }, [segments]);

  const handleUpdateMasterValue = (id: number, value: number) => {
    updateSegmentLocally(id, { master_value: value });
    setDirtySegments((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    const payload = Object.entries(dirtySegments).map(([id, master_value]) => ({
      id: parseInt(id),
      master_value,
    }));
    await updateSegmentsBatch(payload);
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
          <>
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
          </>
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
