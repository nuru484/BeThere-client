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
  const mutation = useMutation({
    mutationFn: ({ eventId, attendanceData }) =>
      createAttendance(eventId, attendanceData),
  });

  return mutation;
};

export const useUpdateAttendance = () => {
  const mutation = useMutation({
    mutationFn: ({ eventId, attendanceData }) =>
      updateAttendance(eventId, attendanceData),
  });

  return mutation;
};

export const useGetUserAttendance = (userId) => {
  const queryClient = useQueryClient();

  const {
    data: userAttendance,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userAttendance", userId],
    queryFn: () => getUserAttendance(userId),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const refetchUserAttendance = () =>
    queryClient.invalidateQueries(["userAttendance", userId]);

  return {
    userAttendance,
    isLoading,
    isError,
    error,
    refetchUserAttendance,
  };
};

export const useEventAttendance = (eventId) => {
  const queryClient = useQueryClient();

  const {
    data: eventAttendance,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["eventAttendance", eventId],
    queryFn: () => getEventAttendance(eventId),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const refetchEventAttendance = () =>
    queryClient.invalidateQueries(["eventAttendance", eventId]);

  return {
    eventAttendance,
    isLoading,
    isError,
    error,
    refetchEventAttendance,
  };
};

export const useGetUserEventAttendance = (userId, eventId) => {
  const queryClient = useQueryClient();

  const {
    data: userEventAttendance,
    error,
    isLoading,
    isError,
  } = useQuery({
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

  const refetchUserEventAttendance = () =>
    queryClient.invalidateQueries(["userEventAttendance", userId, eventId]);

  return {
    userEventAttendance,
    isLoading,
    isError,
    error,
    refetchUserEventAttendance,
  };
};
