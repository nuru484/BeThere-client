import { useLogin } from "@/hooks/useAuth";
import LoginForm from "@/components/LoginForm";
import encryptStorage from "@/lib/encryptedStorage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { ClockIcon, CheckCircle, UserCheck, CircleAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const LoginPage = () => {
  const { mutate: login, isPending, isError, error } = useLogin();
  const { user, login: logUserIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    login(data, {
      onSuccess: (response) => {
        console.log("Login successful:", response);
        logUserIn(response.user);
        encryptStorage.setItem("accessToken", response.accessToken);
        encryptStorage.setItem("refreshToken", response.refreshToken);
        navigate("/dashboard", { replace: true });
      },
    });
  };

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto min-h-screen bg-gray-100 flex justify-center items-center gap-5">
        <LoginForm onSubmit={onSubmit} isLoading={isPending} />

        <div className="hidden lg:flex lg:flex-col lg:w-2/5 p-8">
          <div className="flex items-center gap-3 mb-6">
            <ClockIcon className="text-emerald-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">
              Smart Attendance
            </h1>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="text-emerald-600 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Effortless Tracking
                </h3>
                <p className="text-gray-600">
                  Streamline your attendance management with our intuitive
                  system. Monitor attendance in real-time and generate instant
                  reports.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <UserCheck className="text-emerald-600 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Smart Analytics
                </h3>
                <p className="text-gray-600">
                  Get valuable insights into attendance patterns, helping you
                  make informed decisions and improve organizational efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {isError && (
          <Alert className="w-11/12 max-w-lg border-red-600 mt-8 fixed top-4">
            <div className="flex items-center gap-4">
              <CircleAlert color="#ff0000" />
              <AlertDescription className="text-red-600">
                {error?.message || "An unexpected error occurred."}
              </AlertDescription>
            </div>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
