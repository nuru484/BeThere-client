import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteFaceScan, addFaceScan, getFaceScan } from "@/api/faceScan";

export const useFaceScan = (userId) => {
  const queryClient = useQueryClient();

  const {
    data: facescan,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["facescan", userId],
    queryFn: () => getFaceScan(userId),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const refetchFaceScan = () =>
    queryClient.invalidateQueries(["facescan", userId]);

  return { facescan, isLoading, isError, error, refetchFaceScan };
};

export const useAddFaceScan = () => {
  const mutation = useMutation({
    mutationFn: addFaceScan,
  });

  return mutation;
};

export const useDeleteFaceScan = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ userId }) => deleteFaceScan(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facescan"] });
    },
  });

  return mutation;
};
