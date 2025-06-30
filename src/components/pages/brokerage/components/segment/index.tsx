import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import SegmentBlocks from "./SegmentBlocks"
import { useSegmentStore } from "@/store/useSegmentStore"

export default function Segment() {
  const { segments, fetchSegments, updateSegmentLocally, updateSegmentsBatch } = useSegmentStore()
  const [dirtySegments, setDirtySegments] = useState<Record<number, number>>({}) // { id: newMasterValue }

  useEffect(() => {
    fetchSegments()
  }, [fetchSegments])

  const handleUpdateMasterValue = (id: number, value: number) => {
    updateSegmentLocally(id, { master_value: value })
    setDirtySegments((prev) => ({ ...prev, [id]: value }))
  }

  const handleSave = async () => {
    const payload = Object.entries(dirtySegments).map(([id, master_value]) => ({
      id: parseInt(id),
      master_value,
    }))
    await updateSegmentsBatch(payload)
    setDirtySegments({})
  }

  return (
    <div className="flex flex-col h-full max-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b px-4 py-2">
        <h2 className="text-lg font-semibold">Segment Overview</h2>
        <p className="text-sm text-muted-foreground">
          Summary of each segment — Admin values are fixed and visually distinct.
        </p>
      </div>

      {/* Segments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-4">
        {segments.length ? (
          segments.map((seg) => (
            <SegmentBlocks
              key={seg.id}
              {...seg}
              onUpdateMasterValue={(val) => handleUpdateMasterValue(seg.id, val)}
            />
          ))
        ) : (
          <p className="text-muted-foreground">No segments found.</p>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 z-20 bg-card border-t px-4 py-4">
        <div className="flex justify-end">
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSave}
            disabled={Object.keys(dirtySegments).length === 0}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
