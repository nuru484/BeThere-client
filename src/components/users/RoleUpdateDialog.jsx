// src/components/users/RoleUpdateDialog.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { UserCog, AlertTriangle } from "lucide-react";
import PropTypes from "prop-types";

const RoleUpdateDialog = ({ open, onClose, user, onSubmit, isLoading }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || "USER");

  const handleSubmit = () => {
    onSubmit({ userId: user.id, role: selectedRole });
  };

  const isRoleChanged = selectedRole !== user?.role;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Update User Role
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="font-medium mb-2">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-sm text-gray-600 mb-2">{user?.email}</div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Current Role:</span>
              <Badge
                variant={user?.role === "ADMIN" ? "destructive" : "secondary"}
              >
                {user?.role}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Role</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRole === "ADMIN" && user?.role === "USER" && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Warning</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                This will grant the user administrative privileges including
                user management and system configuration access.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !isRoleChanged}>
            {isLoading ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

RoleUpdateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.oneOf(["ADMIN", "USER"]).isRequired,
  }),
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default RoleUpdateDialog;
