// src/components/LoginForm.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";

const LoginForm = ({ form, onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-semibold text-gray-700">
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                    </div>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      className="w-full pl-12 pr-4 py-3.5 h-auto rounded-xl border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 bg-white"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-destructive text-xs font-medium" />
              </FormItem>
            )}
          />

          {/* Password Input */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-semibold text-gray-700">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full pl-12 pr-12 py-3.5 h-auto rounded-xl border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 bg-white"
                      disabled={isLoading}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      tabIndex={-1}
                      disabled={isLoading}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-destructive text-xs font-medium" />
              </FormItem>
            )}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                disabled={isLoading}
              />
              Remember me
            </label>
            <a
              href="/forgot-password"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition duration-200"
              tabIndex={isLoading ? -1 : 0}
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
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3.5 px-6 h-auto rounded-xl transition-all duration-200 focus:ring-4 focus:ring-emerald-200 focus:outline-none flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Need help?{" "}
          <a
            href="/support"
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
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default LoginForm;
