// src/components/user-profile/ProfileInfoTab.jsx
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Shield,
  Loader2,
  Save,
  Edit3,
  Camera,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useUpdateUserProfile,
  useUpdateUserProfilePicture,
} from "@/hooks/useUsers";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";
import PropTypes from "prop-types";
import { profileFormSchema } from "@/validation/user/profileValidation";

const ProfileInfoTab = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { mutateAsync: updateProfile, isLoading: isUpdatingProfile } =
    useUpdateUserProfile();
  const { mutateAsync: updateProfilePicture, isLoading: isUpdatingPicture } =
    useUpdateUserProfilePicture();

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
    },
  });

  const userInitials = `${user.firstName?.charAt(0) || ""}${
    user.lastName?.charAt(0) || ""
  }`.toUpperCase();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result);
    };
    reader.readAsDataURL(file);
    setSelectedAvatarFile(file);
  };

  const removePreview = () => {
    setImagePreview(null);
    setSelectedAvatarFile(null);
    setIsEditingAvatar(false);
  };

  const handleCancelProfileEdit = () => {
    form.reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
    });
    setIsEditing(false);
  };

  const handleSubmitProfile = async (data) => {
    const toastId = toast.loading("Updating profile...");

    try {
      const response = await updateProfile({
        userId: user.id,
        userData: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || null,
        },
      });

      toast.dismiss(toastId);
      toast.success(response.message || "Profile updated successfully!");

      setIsEditing(false);
    } catch (err) {
      console.error("Profile update error:", err);
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
    }
  };

  const handleSubmitProfilePicture = async () => {
    if (!selectedAvatarFile) {
      toast.error("Please select an image first");
      return;
    }

    const toastId = toast.loading("Updating profile picture...");

    try {
      const formData = new FormData();
      formData.append("profilePicture", selectedAvatarFile);

      const response = await updateProfilePicture({
        userId: user.id,
        formData,
      });

      toast.dismiss(toastId);
      toast.success(
        response.message || "Profile picture updated successfully!"
      );

      setSelectedAvatarFile(null);
      setImagePreview(null);
      setIsEditingAvatar(false);
    } catch (err) {
      console.error("Profile picture update error:", err);
      toast.dismiss(toastId);

      const { message } = extractApiErrorMessage(err);
      toast.error(message);
    }
  };

  const isLoading = isUpdatingProfile || isUpdatingPicture;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          <User className="h-6 w-6" />
          Profile Information
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your personal information and account details
        </p>
      </div>

      {/* Profile Content */}
      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 border border-border rounded-lg bg-muted/30 dark:bg-muted/20">
          <div className="relative group">
            <Avatar
              className={`h-24 w-24 ring-2 ${
                isEditingAvatar ? "ring-brand-orange" : "ring-border"
              }`}
            >
              <AvatarImage
                src={(imagePreview || user.profilePicture) ?? undefined}
                alt={`${user.firstName} ${user.lastName}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-2xl">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            {/* Edit Avatar Button */}
            {!isEditingAvatar && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="avatar-upload"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                  onClick={() => {
                    setIsEditingAvatar(true);
                    document.getElementById("avatar-upload")?.click();
                  }}
                  disabled={isLoading}
                  title="Change profile picture"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Remove Preview Button */}
            {imagePreview && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 shadow-lg"
                onClick={removePreview}
                disabled={isLoading}
              >
                <X className="h-3 w-3" />
              </Button>
            )}

            {/* New Badge */}
            {imagePreview && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-0.5 bg-brand-orange dark:bg-brand-orange-light text-white shadow-md"
                >
                  New
                </Badge>
              </div>
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
              Profile Picture
              {!isEditingAvatar && (
                <Camera
                  className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-brand-orange transition-colors"
                  onClick={() => {
                    setIsEditingAvatar(true);
                    document.getElementById("avatar-upload")?.click();
                  }}
                  title="Click to change"
                />
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {isEditingAvatar
                ? "Select a new image (Max 5MB)"
                : "Hover over avatar or click camera icon to change"}
            </p>
            {imagePreview && (
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSubmitProfilePicture}
                  disabled={isUpdatingPicture}
                  className="bg-gradient-brand hover:opacity-90 text-xs"
                >
                  {isUpdatingPicture ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-1 h-3 w-3" />
                      Save Picture
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={removePreview}
                  disabled={isUpdatingPicture}
                  className="text-xs"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Edit Mode Indicator */}
        {isEditing && (
          <div className="bg-brand-orange/10 dark:bg-brand-orange/20 border-2 border-brand-orange/40 dark:border-brand-orange/50 rounded-lg p-4 animate-in fade-in-50 duration-300">
            <p className="text-sm font-medium text-brand-orange-dark dark:text-brand-orange-light flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-orange"></span>
              </span>
              Edit Mode Active - Make your changes below
            </p>
          </div>
        )}

        {/* Profile Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitProfile)}
            className="space-y-6"
          >
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your first name"
                        disabled={!isEditing || isLoading}
                        className={`h-11 font-medium ${
                          isEditing
                            ? "border-edit bg-edit ring-2 ring-edit focus:ring-brand-orange focus:border-brand-orange transition-all duration-200"
                            : "border-border bg-muted/50"
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your last name"
                        disabled={!isEditing || isLoading}
                        className={`h-11 font-medium ${
                          isEditing
                            ? "border-edit bg-edit ring-2 ring-edit focus:ring-brand-orange focus:border-brand-orange transition-all duration-200"
                            : "border-border bg-muted/50"
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium flex items-center gap-2 text-foreground">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        disabled={!isEditing || isLoading}
                        className={`h-11 font-medium ${
                          isEditing
                            ? "border-edit bg-edit ring-2 ring-edit focus:ring-brand-orange focus:border-brand-orange transition-all duration-200"
                            : "border-border bg-muted/50"
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium flex items-center gap-2 text-foreground">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder="Enter your phone number"
                        disabled={!isEditing || isLoading}
                        className={`h-11 font-medium ${
                          isEditing
                            ? "border-edit bg-edit ring-2 ring-edit focus:ring-brand-orange focus:border-brand-orange transition-all duration-200"
                            : "border-border bg-muted/50"
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Role (Read-only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Role
                </label>
                <div className="h-11 px-3 py-2 border border-border bg-muted/50 rounded-md flex items-center font-medium text-foreground">
                  {user.role || "Not provided"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <Separator className="my-6" />
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
              {!isEditing ? (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  size="lg"
                  className="bg-gradient-brand hover:opacity-90 font-medium"
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelProfileEdit}
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
                    {isUpdatingProfile ? (
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
                </>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

ProfileInfoTab.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    role: PropTypes.string,
    profilePicture: PropTypes.string,
  }).isRequired,
};

export default ProfileInfoTab;
