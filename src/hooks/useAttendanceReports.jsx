// src/hooks/useAttendanceReports.jsx
import { useQuery } from "@tanstack/react-query";
import {
  getAttendanceReport,
  getAttendanceSummary,
  getEventAttendanceRate,
  getUserAttendanceRate,
} from "@/api/attendance-reports";

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

/**
 * Hook to fetch attendance summary with statistics
 * @param {Object} params - Filter parameters
 * @param {Object} options - Additional react-query options
 */
export const useGetAttendanceSummary = (params = {}, options = {}) => {
  const queryKey = ["attendanceSummary", params];

  return useQuery({
    queryKey,
    queryFn: () => getAttendanceSummary(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
    refetchOnReconnect: false,
    ...options,
  });
};

/**
 * Hook to fetch event attendance rate
 * @param {number} eventId - Event ID
 * @param {Object} options - Additional react-query options
 */
export const useGetEventAttendanceRate = (eventId, options = {}) => {
  const queryKey = ["eventAttendanceRate", eventId];

  return useQuery({
    queryKey,
    queryFn: () => getEventAttendanceRate(eventId),
    enabled: !!eventId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
    refetchOnReconnect: false,
    ...options,
  });
};

/**
 * Hook to fetch user attendance rate
 * @param {number} userId - User ID
 * @param {Object} params - Filter parameters (startDate, endDate)
 * @param {Object} options - Additional react-query options
 */
export const useGetUserAttendanceRate = (userId, params = {}, options = {}) => {
  const queryKey = ["userAttendanceRate", userId, params];

  return useQuery({
    queryKey,
    queryFn: () => getUserAttendanceRate(userId, params),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
    keepPreviousData: true,
    refetchOnReconnect: false,
    ...options,
  });
};

/**
 * Hook to fetch multiple report types at once
 * Useful for dashboard views that need multiple reports
 */
export const useGetAttendanceDashboard = (params = {}, options = {}) => {
  const reportQuery = useGetAttendanceReport(params, options);
  const summaryQuery = useGetAttendanceSummary(params, options);

  return {
    report: reportQuery,
    summary: summaryQuery,
    isLoading: reportQuery.isLoading || summaryQuery.isLoading,
    isError: reportQuery.isError || summaryQuery.isError,
    error: reportQuery.error || summaryQuery.error,
  };
};
