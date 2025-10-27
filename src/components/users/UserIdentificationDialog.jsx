// src/components/users/UserIdentificationDialog.jsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetUserIdentifications,
  useCreateUserIdentification,
  useUpdateUserIdentification,
  useDeleteUserIdentification,
} from "@/hooks/useUsers";
import { IdCard, Trash2 } from "lucide-react";
import PropTypes from "prop-types";

const identificationSchema = z.object({
  identityNumber: z.string().min(1, "Identity number is required"),
});

const UserIdentificationDialog = ({ open, onClose, user }) => {
  const [isCreating, setIsCreating] = useState(false);

  const { data: identifications, isLoading } = useGetUserIdentifications(
    user?.id
  );
  
  const createMutation = useCreateUserIdentification();
  const updateMutation = useUpdateUserIdentification();
  const deleteMutation = useDeleteUserIdentification();

  const form = useForm({
    resolver: zodResolver(identificationSchema),
    defaultValues: {
      identityNumber: "",
    },
  });

  const existingIdentification = identifications?.data;

  useEffect(() => {
    if (existingIdentification) {
      form.reset({
        identityNumber: existingIdentification.identityNumber || "",
      });
      setIsCreating(false);
    } else {
      form.reset({ identityNumber: "" });
      setIsCreating(true);
    }
  }, [existingIdentification, form]);

  const handleSubmit = async (data) => {
    try {
      if (existingIdentification) {
        await updateMutation.mutateAsync({
          userId: user.id,
          identificationData: data,
        });
      } else {
        await createMutation.mutateAsync({
          userId: user.id,
          identificationData: data,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error managing identification:", error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this identification?")
    ) {
      try {
        await deleteMutation.mutateAsync(user.id);
        form.reset({ identityNumber: "" });
        setIsCreating(true);
      } catch (error) {
        console.error("Error deleting identification:", error);
      }
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IdCard className="h-5 w-5" />
            Manage User Identification
          </DialogTitle>
          <div className="text-sm text-gray-600">
            {user?.firstName} {user?.lastName} - {user?.email}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="text-gray-500">Loading identification...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {existingIdentification && !isCreating && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="success">Active</Badge>
                      <span className="text-sm text-gray-600">
                        Created:{" "}
                        {new Date(
                          existingIdentification.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-medium">
                      ID: {existingIdentification.identityNumber}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="identityNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {existingIdentification
                          ? "Update Identity Number"
                          : "Identity Number"}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter identity number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Saving..."
                      : existingIdentification
                      ? "Update Identification"
                      : "Create Identification"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

UserIdentificationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
};

export default UserIdentificationDialog;
