import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  fetchEvent,
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/api/event";

export const useGetEvent = (eventId) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEvent(eventId),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useGetEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }) => updateEvent(eventId, data),
    onSuccess: (data, { eventId }) => {
      queryClient.invalidateQueries(["event", eventId]);
      queryClient.invalidateQueries(["events"]);
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ eventId }) => deleteEvent(eventId),
    onSuccess: (eventId) => {
      queryClient.invalidateQueries(["event", eventId]);
      queryClient.invalidateQueries(["events"]);
    },
  });

  return mutation;
};
