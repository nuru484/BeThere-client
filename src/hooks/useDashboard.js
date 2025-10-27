// src/hooks/useDashboard.js
import { useQuery } from "@tanstack/react-query";
import {
  getTotalUsersCount,
  getTotalEventsCount,
  getUpcomingEventsCount,
  getAttendanceRecordsToday,
  getRecentActivityFeed,
} from "@/api/dashboard";

export const useGetTotalUsers = () => {
  const {
    data: totalUsers,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["totalUsers"],
    queryFn: getTotalUsersCount,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    totalUsers,
    isLoading,
    isError,
    error,
  };
};

export const useGetTotalEvents = () => {
  const {
    data: totalEvents,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["totalEvents"],
    queryFn: getTotalEventsCount,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    totalEvents,
    isLoading,
    isError,
    error,
  };
};

export const useGetUpcomingEvents = () => {
  const {
    data: upcomingEvents,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: getUpcomingEventsCount,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    upcomingEvents,
    isLoading,
    isError,
    error,
  };
};

export const useGetTodayAttendance = () => {
  const {
    data: todayAttendance,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todayAttendance"],
    queryFn: getAttendanceRecordsToday,
    staleTime: 1000 * 60 * 2, // 2 minutes for more frequent updates
    cacheTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5, // Auto-refetch every 5 minutes
  });

  return {
    todayAttendance,
    isLoading,
    isError,
    error,
  };
};

export const useGetRecentActivity = () => {
  const {
    data: recentActivity,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recentActivity"],
    queryFn: getRecentActivityFeed,
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 3, // Auto-refetch every 3 minutes
  });

  return {
    recentActivity,
    isLoading,
    isError,
    error,
  };
};
