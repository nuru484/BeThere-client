// src/hooks/useAttendanceReports.jsx
import { useQuery } from "@tanstack/react-query";
import { getAttendanceReport } from "@/api/attendance-reports.js";

/**
 * Hook to fetch comprehensive attendance report
 * @param {Object} params - Filter parameters
 * @param {Object} options - Additional react-query options
 */
export const useGetAttendanceReport = (params = {}, options = {}) => {
  const queryKey = ["attendanceReport", params];

  return useQuery({
    queryKey,
    queryFn: () => getAttendanceReport(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
    keepPreviousData: true,
    refetchOnReconnect: false,
    ...options,
  });
};
