// src/components/attendance/eventAttendance/table/columns.jsx
import { ArrowUpDown, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventAttendanceActionsDropdown } from "./EventAttendanceActionsDropdown";

const getStatusVariant = (status) => {
  switch (status) {
    case "PRESENT":
      return "default";
    case "LATE":
      return "secondary";
    case "ABSENT":
      return "destructive";
    default:
      return "outline";
  }
};

export const createEventAttendanceColumns = () => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? "indeterminate"
            : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 h-auto font-semibold hover:bg-transparent text-left justify-start"
      >
        <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        User
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.profilePicture} alt={user?.firstName} />
            <AvatarFallback>
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="max-w-[200px] sm:max-w-[300px]">
            <div className="font-medium truncate text-sm sm:text-base">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground truncate">
              {user?.email}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge variant={getStatusVariant(status)} className="text-xs">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "session.startDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 h-auto font-semibold hover:bg-transparent"
      >
        <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        Session Date
        <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const startDate = row.original.session?.startDate;
      if (!startDate) return <span className="text-xs sm:text-sm">N/A</span>;
      const date = new Date(startDate);
      return (
        <div className="text-xs sm:text-sm">
          <div>{format(date, "MMM dd, yyyy")}</div>
          <div className="text-muted-foreground">{format(date, "hh:mm a")}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "checkInTime",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 h-auto font-semibold hover:bg-transparent"
      >
        Check In
        <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("checkInTime"));
      return (
        <div className="text-xs sm:text-sm">
          <div>{format(date, "MMM dd, yyyy")}</div>
          <div className="text-muted-foreground">{format(date, "hh:mm a")}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "checkOutTime",
    header: "Check Out",
    cell: ({ row }) => {
      const checkOutTime = row.getValue("checkOutTime");
      if (!checkOutTime) {
        return (
          <span className="text-xs sm:text-sm text-muted-foreground">
            Not checked out
          </span>
        );
      }
      const date = new Date(checkOutTime);
      return (
        <div className="text-xs sm:text-sm">
          <div>{format(date, "MMM dd, yyyy")}</div>
          <div className="text-muted-foreground">{format(date, "hh:mm a")}</div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => (
      <EventAttendanceActionsDropdown attendance={row.original} />
    ),
  },
];
