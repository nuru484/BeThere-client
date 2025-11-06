// src/hooks/useFaceScanApi.js
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteFaceScan, addFaceScan, getUserFaceScan } from "@/api/faceScan";

export const useGetUserFaceScan = (userId) => {
  return useQuery({
    queryKey: ["facescan", userId],
    queryFn: () => getUserFaceScan(userId),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useAddFaceScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => addFaceScan(userData),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries(["facescan", userId]);
    },
  });
};

export const useDeleteFaceScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }) => deleteFaceScan(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facescan"] });
    },
  });
};
