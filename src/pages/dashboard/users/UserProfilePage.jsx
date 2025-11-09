// src/pages/dashboard/users/UserProfilePage.jsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SecurityTab from "@/components/users/user-profile/SecurityTab";
import ProfileInfoTab from "@/components/users/user-profile/ProfileInfoTab";
import { User, Shield } from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGetUser } from "@/hooks/useUsers";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ProfileSkeleton } from "@/components/users/user-profile/ProfilePageSkeleton";

const UserProfilePage = () => {
  const { userId } = useParams();

  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const isAdmin = currentUser?.role === "ADMIN";
  const isViewingOwnProfile = parseInt(currentUser?.id) === parseInt(userId);

  const shouldFetchUser = isAdmin && !isViewingOwnProfile;

  const {
    data: userData,
    error,
    isError,
    isLoading,
    refetch,
  } = useGetUser(userId);

  const { message: errorMessage } = extractApiErrorMessage(error);

  const displayUser =
    shouldFetchUser && userData?.data ? userData.data : currentUser;

  if (isLoading && shouldFetchUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (isError && shouldFetchUser) {
    return (
      <div className="max-w-6xl mx-auto">
        <ErrorMessage error={errorMessage} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Admin Viewing Banner */}
        {isAdmin && !isViewingOwnProfile && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Viewing profile as administrator:{" "}
              <span className="font-semibold">
                {displayUser?.name || displayUser?.email}
              </span>
            </p>
          </div>
        )}

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted mb-8 h-12">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground flex items-center gap-2 font-medium"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile Info</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isViewingOwnProfile}
            >
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-0">
            <ProfileInfoTab user={displayUser} />
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            {isViewingOwnProfile && <SecurityTab />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfilePage;
