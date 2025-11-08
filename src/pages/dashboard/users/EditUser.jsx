import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import { useGetUser } from "@/hooks/useUsers";
import ErrorMessage from "@/components/ui/ErrorMessage";
import UserForm from "@/components/users/UserForm";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";

export default function EditUserPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const parsedUserId = parseInt(userId, 10);

  const {
    data: userData,
    error,
    isError,
    isLoading,
    refetch,
  } = useGetUser(parsedUserId);

  const user = userData?.data;

  const handleGoBack = () => {
    navigate("/dashboard/users");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card className="shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const { message } = extractApiErrorMessage(error);

  if (isError) {
    return <ErrorMessage error={message} onRetry={refetch} />;
  }

  if (!user) {
    return <ErrorMessage error="User not found" onRetry={refetch} />;
  }

  return (
    <div className="container mx-auto space-y-10">
      <div className="border-b border-border pb-4 sm:pb-6">
        {/* Mobile Layout */}
        <div className="flex flex-col space-y-3 sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-2 self-start"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Edit User</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Update user details below
            </p>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Edit User</h1>
              <p className="text-sm text-muted-foreground">
                Update user details below
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-2 shrink-0 ml-4 hover:cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Users</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>
      </div>

      <UserForm mode="edit" user={user} />
    </div>
  );
}
