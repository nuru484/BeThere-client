// src/components/users/table/UserActionsDropdown.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Trash2, Shield, User, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useUpdateUserRole, useDeleteUser } from "@/hooks/useUsers";
import PropTypes from "prop-types";

export function UserActionsDropdown({ user }) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const updateUserRoleMutation = useUpdateUserRole();
  const deleteUserMutation = useDeleteUser();

  const handleChangeRole = async (newRole) => {
    const toastId = toast.loading(`Changing role to ${newRole}...`);

    try {
      const response = await updateUserRoleMutation.mutateAsync({
        userId: user.id,
        role: newRole,
      });

      toast.dismiss(toastId);
      toast.success(
        response.message || `User role changed to ${newRole} successfully`
      );
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async () => {
    const toastId = toast.loading("Deleting user...");

    try {
      const response = await deleteUserMutation.mutateAsync(user.id);
      toast.dismiss(toastId);
      toast.success(response.message || "User deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message || "Failed to delete user");
      setDeleteDialogOpen(false);
    }
  };

  const roleOptions = [
    { value: "ADMIN", label: "Admin" },
    { value: "USER", label: "User" },
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* View User Details */}
          <DropdownMenuItem
            onClick={() => navigate(`/dashboard/users/${user.id}/user-profile`)}
            className="hover:cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>

          {/* Edit User Details */}
          <DropdownMenuItem
            onClick={() =>
              navigate(`/dashboard/users/${user.id}/update-profile`)
            }
            className="hover:cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Details
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Update Role Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hover:cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              Update Role
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {roleOptions.map((role) => (
                <DropdownMenuItem
                  key={role.value}
                  className="hover:cursor-pointer"
                  onClick={() => handleChangeRole(role.value)}
                  disabled={user.role === role.value}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  {role.label}
                  {user.role === role.value && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      Current
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 hover:cursor-pointer"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete User"
        description={`Are you sure you want to delete "${user.firstName} ${user.lastName}"? This action cannot be undone.`}
        onConfirm={handleDeleteUser}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
}

UserActionsDropdown.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string,
    role: PropTypes.oneOf(["ADMIN", "USER"]).isRequired,
  }).isRequired,
};
