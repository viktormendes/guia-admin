import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row justify-between mr-8">
        <div className="flex flex-col gap-2 px-8 pt-8 pb-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="flex flex-col gap-3 px-8 pb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  )
} 