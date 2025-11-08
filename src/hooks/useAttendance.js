// src/hooks/useAttendance.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAttendance,
  updateAttendance,
  getUserAttendance,
  getEventAttendance,
  getUserEventAttendance,
} from "@/api/attendance";

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, attendanceData }) =>
      createAttendance(eventId, attendanceData),
    onSuccess: () => {
      queryClient.invalidateQueries(["attendance"]);
    },
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }) => updateAttendance(eventId, data),
    onSuccess: (data, { eventId }) => {
      queryClient.invalidateQueries(["attendance", eventId]);
      queryClient.invalidateQueries(["attendance"]);
    },
  });
};

export const useGetUserAttendance = (userId, params = {}) => {
  const queryKey = ["userAttendance", userId, params];

  return useQuery({
    queryKey,
    queryFn: () => getUserAttendance(userId, params),
    cacheTime: 1000 * 60 * 30,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    keepPreviousData: true,
  });
};

export const useEventAttendance = (eventId) => {
  return useQuery({
    queryKey: ["eventAttendance", eventId],
    queryFn: () => getEventAttendance(eventId),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useGetUserEventAttendance = (userId, eventId) => {
  return useQuery({
    queryKey: ["userEventAttendance", userId, eventId],
    queryFn: () => getUserEventAttendance(userId, eventId),
    enabled: !!(userId && eventId),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
