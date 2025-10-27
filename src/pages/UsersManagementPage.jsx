// src/pages/UsersManagementPage.jsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Search,
  Filter,
  Download,
  UserCheck,
  Crown,
  IdCard,
} from "lucide-react";
import UserTable from "@/components/users/UserTable";
import UserFormDialog from "@/components/users/UserFormDialog";
import RoleUpdateDialog from "@/components/users/RoleUpdateDialog";
import {
  useGetUsers,
  useUpdateUser,
  useDeleteUser,
  useUpdateUserRole,
} from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { Link } from "react-router-dom";

const UsersManagementPage = () => {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Dialog states
  const [showUserForm, setShowUserForm] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Build query parameters
  const queryParams = {
    page: currentPage,
    limit: pageSize,
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    ...(roleFilter !== "all" && { role: roleFilter }),
  };

  // Hooks
  const { data: usersData, isLoading, error } = useGetUsers(queryParams);
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const updateRoleMutation = useUpdateUserRole();

  const users = usersData?.data || [];
  const pagination = usersData?.pagination || {};

  // Calculate stats
  const totalUsers = pagination.totalRecords || 0;
  const adminCount = users.filter((user) => user.role === "ADMIN").length;
  const userCount = users.filter((user) => user.role === "USER").length;
  const withIdentification = users.filter((user) => user.identification).length;

  // Handlers
  const handleUpdateUser = async (userData) => {
    try {
      await updateUserMutation.mutateAsync({
        userId: selectedUser.id,
        userData,
      });
      setShowUserForm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      setShowDeleteDialog(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateRole = async (data) => {
    try {
      await updateRoleMutation.mutateAsync(data);
      setShowRoleDialog(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  // Dialog handlers
  const openEditDialog = (user) => {
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const openRoleDialog = (user) => {
    setSelectedUser(user);
    setShowRoleDialog(true);
  };

  const closeDialogs = () => {
    setShowUserForm(false);
    setShowRoleDialog(false);
    setShowDeleteDialog(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600">Manage users and their roles</p>
          </div>
        </div>
        <Link to="/dashboard/user-identifications">
          <Button variant="outline" className="mr-2">
            <IdCard className="mr-2 h-4 w-4" />
            View Identifications
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Administrators</p>
                <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Regular Users</p>
                <p className="text-2xl font-bold text-gray-900">{userCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <IdCard className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-600">With ID</p>
                <p className="text-2xl font-bold text-gray-900">
                  {withIdentification}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {error ? (
            <div className="text-center py-8">
              <div className="text-red-500">
                <p className="text-lg font-medium">Error loading users</p>
                <p className="text-sm">{error.message}</p>
              </div>
            </div>
          ) : (
            <>
              <UserTable
                users={users}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                onUpdateRole={openRoleDialog}
                currentUserId={currentUser?.id}
                isLoading={isLoading}
              />

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, totalUsers)} of{" "}
                    {totalUsers} users
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(pagination.totalPages, prev + 1)
                        )
                      }
                      disabled={currentPage === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <UserFormDialog
        open={showUserForm}
        onClose={closeDialogs}
        user={selectedUser}
        onSubmit={handleUpdateUser}
        isLoading={updateUserMutation.isPending}
      />

      <RoleUpdateDialog
        open={showRoleDialog}
        onClose={closeDialogs}
        user={selectedUser}
        onSubmit={handleUpdateRole}
        isLoading={updateRoleMutation.isPending}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {selectedUser?.firstName} {selectedUser?.lastName}
              </span>
              ? This action cannot be undone and will remove all associated data
              including attendance records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDialogs}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersManagementPage;
