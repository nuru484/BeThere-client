// src/components/users/UserForm.jsx
"use client";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAddUser, useUpdateUser } from "@/hooks/useUsers";
import PropTypes from "prop-types";
import { extractApiErrorMessage } from "@/utils/extract-api-error-message";

// Validation Schema
const userFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  role: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
  password: z.string().optional(),
});

export default function UserForm({ mode, user }) {
  const navigate = useNavigate();

  // Mutations
  const { mutateAsync: createUser, isLoading: isCreating } = useAddUser();
  const { mutateAsync: updateUserProfile, isLoading: isUpdating } =
    useUpdateUser();

  const defaultValues = useMemo(
    () => ({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role: user?.role || "USER",
    }),
    [user]
  );

  const form = useForm({
    resolver: zodResolver(
      mode === "create"
        ? userFormSchema.extend({
            password: z
              .string()
              .min(4, "Password must be at least 4 characters"),
          })
        : userFormSchema
    ),
    defaultValues,
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
      };
      if (values.phone) payload.phone = values.phone;
      if (values.password) payload.password = values.password;

      let response;
      if (mode === "create") {
        response = await createUser(payload);
        toast.success(response.message || "User created successfully");
        navigate(`/dashboard/users/${response.data.id}/user-profile`);
      } else {
        response = await updateUserProfile({
          userId: user.id,
          userData: payload,
        });
        toast.success(response.message || "User updated successfully");
        navigate(`/dashboard/users/${response.data.id}/user-profile`);
      }
    } catch (error) {
      console.error("User form submission error:", error);

      const { message, fieldErrors, hasFieldErrors } =
        extractApiErrorMessage(error);

      if (hasFieldErrors && fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          form.setError(field, {
            message: errorMessage,
          });
        });
        toast.error(message);
      } else {
        toast.error(message);
      }
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl mx-auto">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+233 54 648 8115"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role — Show only in create mode */}
              {mode === "create" && (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Hidden input to preserve role in edit mode */}
              {mode === "edit" && (
                <input
                  type="hidden"
                  {...form.register("role")}
                  value={form.getValues("role")}
                />
              )}

              {/* Password (only for create mode) */}
              {mode === "create" && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a strong password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/users")}
                  disabled={isLoading}
                  className="flex-1 cursor-pointer"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 cursor-pointer"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {mode === "create" ? "Create User" : "Update User"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

UserForm.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]).isRequired,
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    role: PropTypes.oneOf(["USER", "ADMIN"]),
  }),
};
