// LoginPage.jsx
import { useLogin } from "@/hooks/useAuth";
import LoginForm from "@/components/LoginForm";
import encryptStorage from "@/lib/encryptedStorage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { CheckCircle, UserCheck, CircleAlert } from "lucide-react";
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
        logUserIn(response.user);
        encryptStorage.setItem("accessToken", response.accessToken);
        encryptStorage.setItem("refreshToken", response.refreshToken);
        navigate("/dashboard", { replace: true });
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-emerald-50 via-white to-green-50 font-sans antialiased">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <img
                src={"/assets/logo.png"}
                alt="BeThere Logo"
                className="h-10 w-10 object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">
              BeThere
            </span>
          </div>

          <div className="mt-16">
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Modern Attendance
              <br />
              Management System
            </h2>
            <p className="text-emerald-100 text-lg leading-relaxed max-w-md">
              Streamline your attendance tracking with our intelligent, secure,
              and easy-to-use platform designed for modern organizations.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <CheckCircle
                className="text-white mt-1 flex-shrink-0"
                size={24}
              />
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Effortless Tracking
                </h3>
                <p className="text-emerald-100 text-sm">
                  Monitor attendance in real-time and generate instant reports
                  with our intuitive system.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <UserCheck className="text-white mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Smart Analytics
                </h3>
                <p className="text-emerald-100 text-sm">
                  Get valuable insights into attendance patterns and make
                  informed decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <LoginForm onSubmit={onSubmit} isLoading={isPending} />

        {/* Error Alert */}
        {isError && (
          <Alert className="max-w-md border-l-4 border-red-500 bg-red-50 fixed top-8 left-1/2 -translate-x-1/2 animate-shake shadow-lg">
            <div className="flex items-start">
              <CircleAlert className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <AlertDescription className="text-sm font-medium text-red-800">
                {error?.message ||
                  "An unexpected error occurred. Please try again."}
              </AlertDescription>
            </div>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
