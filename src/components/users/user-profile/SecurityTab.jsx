// src/components/users/user-profile/SecurityTab.jsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Loader2, Eye, EyeOff, Lock, Save } from "lucide-react";
import { useChangePassword } from "@/hooks/useUsers";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";
import { passwordSchema } from "@/validation/user/profileValidation";

const SecurityTab = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: changePassword, isLoading } = useChangePassword();

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handlePasswordChange = async (data) => {
    const toastId = toast.loading("Changing password...");

    changePassword(
      {
        data: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      },
      {
        onSuccess: (response) => {
          toast.dismiss(toastId);
          toast.success(response.message || "Password changed successfully!");

          form.reset();
          setIsChangingPassword(false);
          setShowCurrentPassword(false);
          setShowNewPassword(false);
          setShowConfirmPassword(false);
        },
        onError: (err) => {
          console.error("Password change error:", err);
          toast.dismiss(toastId);

          const { message, fieldErrors, hasFieldErrors } =
            extractApiErrorMessage(err);

          if (hasFieldErrors && fieldErrors) {
            Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
              if (field in form.getValues()) {
                form.setError(field, {
                  message: errorMessage,
                });
              }
            });
            toast.error(message);
          } else {
            toast.error(message);
          }
        },
      }
    );
  };

  const handleCancel = () => {
    form.reset();
    setIsChangingPassword(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Password and Security
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your password and authentication settings
        </p>
      </div>

      <Separator className="my-6" />

      {/* Password Information Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Lock className="h-5 w-5" />
            Password Information
          </h3>
          <p className="text-sm text-muted-foreground">
            Keep your account secure with a strong password
          </p>
        </div>

        {!isChangingPassword ? (
          <div className="flex justify-between items-center p-4 border border-border rounded-lg bg-muted/30 dark:bg-muted/20 shadow-sm">
            <div>
              <p className="text-sm font-medium text-foreground">Password</p>
              <p className="text-xs text-muted-foreground">
                Last changed recently
              </p>
            </div>
            <Button
              onClick={() => setIsChangingPassword(true)}
              size="sm"
              className="bg-gradient-brand hover:opacity-90 font-medium"
            >
              Change Password
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handlePasswordChange)}
              className="space-y-6"
            >
              {/* Edit Mode Indicator */}
              <div className="bg-brand-orange/10 dark:bg-brand-orange/20 border-2 border-brand-orange/40 dark:border-brand-orange/50 rounded-lg p-4 animate-in fade-in-50 duration-300">
                <p className="text-sm font-medium text-brand-orange-dark dark:text-brand-orange-light flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-orange"></span>
                  </span>
                  Password Change Mode Active - Enter your passwords below
                </p>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 gap-5">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium flex items-center gap-2 text-foreground">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter your current password"
                            disabled={isLoading}
                            className="h-11 pr-10 border-edit bg-edit ring-2 ring-edit focus:ring-brand-orange focus:border-brand-orange transition-all duration-200 font-medium"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium flex items-center gap-2 text-foreground">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            disabled={isLoading}
                            className="h-11 pr-10 border-edit bg-edit ring-2 ring-edit focus:ring-brand-orange focus:border-brand-orange transition-all duration-200 font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium flex items-center gap-2 text-foreground">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            disabled={isLoading}
                            className="h-11 pr-10 border-edit bg-edit ring-2 ring-edit focus:ring-brand-orange focus:border-brand-orange transition-all duration-200 font-medium"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <Separator className="my-6" />
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  size="lg"
                  className="w-full sm:w-auto border-border/80 hover:bg-accent hover:border-accent-foreground/20 font-medium"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-brand hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>

      <Separator className="my-6" />

      {/* Two-Factor Authentication Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </h3>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account
          </p>
        </div>

        <div className="flex justify-between items-center p-4 border border-border rounded-lg bg-muted/30 dark:bg-muted/20 shadow-sm">
          <div>
            <p className="text-sm font-medium text-foreground">Enable 2FA</p>
            <p className="text-xs text-muted-foreground">
              Secure your account with two-factor authentication
            </p>
          </div>
          <Switch className="data-[state=checked]:bg-brand-orange" />
        </div>
      </div>

      <Separator className="my-6" />

      {/* Danger Zone Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-destructive flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground">
            Irreversible and destructive actions
          </p>
        </div>

        <div className="flex justify-between items-center p-4 border-2 border-destructive/30 rounded-lg bg-destructive/5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-destructive">
              Delete Account
            </p>
            <p className="text-xs text-muted-foreground">
              Permanently delete your account and all data
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
