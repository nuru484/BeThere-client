// src/components/FaceScanner/FaceScannerSkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";

export default function FaceScannerSkeleton() {
  return (
    <div className="w-full max-w-2xl">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl">
        {/* Video container skeleton */}
        <div className="relative bg-black rounded-xl overflow-hidden mb-6 shadow-inner">
          <div className="w-full h-80 bg-gray-800 relative">
            {/* Simulated video loading pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 via-gray-800/40 to-gray-900/60"></div>

            {/* Face detection overlay skeleton */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-64 h-80">
                {/* Corner brackets - dimmed */}
                <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-gray-600/50 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-gray-600/50 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-gray-600/50 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-gray-600/50 rounded-br-lg"></div>

                {/* Status indicator dot skeleton */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </div>

            {/* Corner decorations skeleton */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gray-700/50"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gray-700/50"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gray-700/50"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gray-700/50"></div>

            {/* Loading indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
                <p className="text-white text-sm font-medium">
                  Initializing camera...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action button skeleton */}
        <Skeleton className="w-full h-14 rounded-xl" />
      </div>

      {/* Status indicator skeleton */}
      <div className="text-center font-medium p-4 mt-4 border bg-gray-50 rounded-lg">
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>

      {/* Instructions skeleton */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Skeleton className="h-4 w-24 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    </div>
  );
}
