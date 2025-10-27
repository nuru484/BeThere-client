// src/hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  updateUser,
  deleteUser,
  updateUserRole,
  getUserIdentifications,
  createUserIdentification,
} from "@/api/users";
import { toast } from "sonner";

export const useGetUsers = (params = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }) => updateUser(userId, userData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["user", userId]);
      toast.success("User updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, role),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["user", userId]);
      toast.success("User role updated successfully!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update user role"
      );
    },
  });
};

export const useGetUserIdentifications = (params = {}) => {
  return useQuery({
    queryKey: ["userIdentifications", params],
    queryFn: () => getUserIdentifications(params),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useCreateUserIdentification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserIdentification,
    onSuccess: () => {
      queryClient.invalidateQueries(["userIdentifications"]);
      queryClient.invalidateQueries(["users"]);
      toast.success("User identification created successfully!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create identification"
      );
    },
  });
};