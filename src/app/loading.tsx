import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8 p-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Skeleton className="h-10 w-full md:w-1/3" />
        <div className="flex gap-2 w-full md:w-2/3">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-1/3" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <Skeleton className="h-40 w-full rounded-t-lg" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
