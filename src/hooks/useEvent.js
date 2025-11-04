import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  fetchEvent,
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/api/event";

export const useGetEvent = (eventId) => {
  const queryClient = useQueryClient();

  const {
    data: event,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEvent(eventId),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const refetchEvent = () => queryClient.invalidateQueries(["event", eventId]);

  return { event, isLoading, isError, error, refetchEvent };
};

export const useGetEvents = () => {
  const queryClient = useQueryClient();

  const {
    data: events,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const refetchEvents = () => queryClient.invalidateQueries(["events"]);

  return { events, isLoading, isError, error, refetchEvents };
};

export const useCreateEvent = () => {
  const mutation = useMutation({
    mutationFn: createEvent,
  });

  return mutation;
};

export const useUpdateEvent = () => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => updateEvent(id, data),
  });

  return mutation;
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id }) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
    },
  });

  return mutation;
};
