// LoginForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { ArrowRight, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";

const LoginForm = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="w-full max-w-md">
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg">
          <img
            src={"/assets/logo.png"}
            alt="BeThere Logo"
            className="h-10 w-10 object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
          BeThere
        </span>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700"
          >
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
            </div>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="Enter your email"
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
              } focus:ring-4 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 bg-white`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700"
          >
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              placeholder="Enter your password"
              className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
              } focus:ring-4 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 bg-white`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            Remember me
          </label>

          <a
            href="#"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition duration-200"
          >
            Forgot password?
          </a>
        </div>

        {/* Security Badge */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-start gap-3">
          <Shield className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-emerald-900">
              Secure Connection
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Your data is encrypted and protected
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-emerald-200 focus:outline-none flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isLoading ? (
            <span>Signing In...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Need help?{" "}
          <a
            href="#"
            className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
          >
            Contact Support
          </a>
        </p>
        <p className="text-xs text-gray-400 mt-3">
          Powered by{" "}
          <span className="font-semibold text-gray-600">BeThere</span> • Secure
          System
        </p>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default LoginForm;
