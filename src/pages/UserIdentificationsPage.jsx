// src/pages/UserIdentificationsPage.jsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  IdCard,
  Plus,
  Search,
  ArrowLeft,
  Users,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  useGetUserIdentifications,
  useCreateUserIdentification,
} from "@/hooks/useUsers";
import { useDebounce } from "@/hooks/useDebounce";

const UserIdentificationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const queryParams = {
    page: currentPage,
    limit: pageSize,
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
  };

  const {
    data: identificationsData,
    isLoading,
    error,
  } = useGetUserIdentifications(queryParams);
  const createIdentificationMutation = useCreateUserIdentification();

  const identifications = identificationsData?.data || [];
  const pagination = identificationsData?.pagination || {};

  const totalIdentifications = pagination.totalRecords || 0;
  const assignedIdentifications = identifications.filter(
    (id) => id.user
  ).length;
  const unassignedIdentifications =
    totalIdentifications - assignedIdentifications;

  const handleCreateIdentification = async () => {
    try {
      await createIdentificationMutation.mutateAsync();
    } catch (error) {
      console.error("Error creating identification:", error);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/users">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="p-2 bg-emerald-100 rounded-lg">
            <IdCard className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Identifications
            </h1>
            <p className="text-gray-600">Manage user identification numbers</p>
          </div>
        </div>
        <Button
          onClick={handleCreateIdentification}
          disabled={createIdentificationMutation.isPending}
        >
          <Plus className="mr-2 h-4 w-4" />
          {createIdentificationMutation.isPending
            ? "Creating..."
            : "Create New ID"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <IdCard className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total IDs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalIdentifications}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignedIdentifications}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Unassigned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {unassignedIdentifications}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Identifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Identifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID number or user name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {error ? (
            <div className="text-center py-8">
              <div className="text-red-500">
                <p className="text-lg font-medium">
                  Error loading identifications
                </p>
                <p className="text-sm">{error.message}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Number</TableHead>
                      <TableHead>Assigned User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-gray-500">
                            Loading identifications...
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : identifications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="text-gray-500">
                            <p className="text-lg font-medium">
                              No identifications found
                            </p>
                            <p className="text-sm">
                              Try adjusting your search or create a new
                              identification
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      identifications.map((identification) => (
                        <TableRow key={identification.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <IdCard className="h-4 w-4 text-blue-600" />
                              <span className="font-mono font-medium">
                                {identification.identityNumber}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {identification.user ? (
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={identification.user.profilePicture}
                                    alt={identification.user.firstName}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {getInitials(
                                      identification.user.firstName,
                                      identification.user.lastName
                                    )}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {identification.user.firstName}{" "}
                                    {identification.user.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {identification.user.email}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">
                                Unassigned
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {identification.user ? (
                              <Badge
                                variant={
                                  identification.user.role === "ADMIN"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {identification.user.role}
                              </Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                identification.user ? "default" : "outline"
                              }
                            >
                              {identification.user ? "Assigned" : "Available"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {format(
                                new Date(identification.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, totalIdentifications)} of{" "}
                    {totalIdentifications} identifications
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
    </div>
  );
};

export default UserIdentificationsPage;
