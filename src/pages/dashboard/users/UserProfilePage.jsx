// src/pages/dashboard/users/UserProfilePage.jsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SecurityTab from "@/components/users/user-profile/SecurityTab";
import ProfileInfoTab from "@/components/users/user-profile/ProfileInfoTab";
import { User, Shield, AlertCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGetUser } from "@/hooks/useUsers";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ProfileSkeleton } from "@/components/users/user-profile/ProfilePageSkeleton";
import { Badge } from "@/components/ui/badge";

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
    return <ProfileSkeleton />;
  }

  if (isError && shouldFetchUser) {
    return <ErrorMessage error={errorMessage} onRetry={refetch} />;
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-6">
      {/* Admin Viewing Banner */}
      {isAdmin && !isViewingOwnProfile && (
        <div className="p-4 bg-primary/5 dark:bg-primary/10 border-2 border-primary/30 dark:border-primary/40 rounded-lg shadow-sm animate-in fade-in-50 duration-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary mb-1">
                Administrator View
              </p>
              <p className="text-sm text-foreground">
                Viewing profile for:{" "}
                <span className="font-semibold">
                  {displayUser?.firstName && displayUser?.lastName
                    ? `${displayUser.firstName} ${displayUser.lastName}`
                    : displayUser?.email}
                </span>
              </p>
            </div>
            <Badge className="bg-primary text-primary-foreground font-semibold">
              Admin
            </Badge>
          </div>
        </div>
      )}

      {/* Profile Tabs Card */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile Information</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2"
            disabled={!isViewingOwnProfile}
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security Settings</span>
            <span className="sm:hidden">Security</span>
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
  );
};

export default UserProfilePage;
