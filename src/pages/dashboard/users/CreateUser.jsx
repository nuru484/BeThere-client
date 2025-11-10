import UserForm from "@/components/users/UserForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateUserPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/dashboard/users");
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="space-y-3 sm:space-y-0">
        {/* Back Button - Mobile Only */}
        <div className="flex justify-end sm:hidden">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200 text-gray-700 hover:bg-gray-50 h-8"
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back
          </Button>
        </div>

        {/* Header with Back Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight break-words">
                Create User
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1 sm:mt-1.5 leading-snug">
                Fill in details to add a new user to the system
              </p>
            </div>
          </div>

          {/* Back Button - Desktop Only */}
          <Button
            variant="outline"
            className="hidden sm:flex border-gray-200 text-gray-700 hover:bg-gray-50 flex-shrink-0"
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </div>
      </div>

      <UserForm />
    </div>
  );
}
