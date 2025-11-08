// src/components/attendance/tables/userAttendance/columns.jsx
import { ArrowUpDown, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AttendanceActionsDropdown } from "../../tables/userAttendance/AttendanceActionsDropdown";

const getStatusVariant = (status) => {
  switch (status) {
    case "PRESENT":
      return "default"; // or "success" if you have it
    case "LATE":
      return "secondary";
    case "ABSENT":
      return "destructive";
    default:
      return "outline";
  }
};

// const getStatusColor = (status) => {
//   switch (status) {
//     case "PRESENT":
//       return "text-green-600";
//     case "LATE":
//       return "text-yellow-600";
//     case "ABSENT":
//       return "text-red-600";
//     default:
//       return "";
//   }
// };

export const createAttendanceColumns = () => [
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
    accessorKey: "session.event.title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 h-auto font-semibold hover:bg-transparent text-left justify-start"
      >
        Event
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const event = row.original.session?.event;
      return (
        <div className="max-w-[200px] sm:max-w-[300px]">
          <div className="font-medium truncate text-sm sm:text-base">
            {event?.title || "N/A"}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mt-1">
            {event?.type || "N/A"}
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
    accessorKey: "checkInTime",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 h-auto font-semibold hover:bg-transparent"
      >
        <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
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
    accessorKey: "session.event.location",
    header: "Location",
    cell: ({ row }) => {
      const location = row.original.session?.event?.location;
      return (
        <div className="max-w-[150px]">
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="truncate">{location?.name || "N/A"}</span>
          </div>
          {location?.city && (
            <div className="text-xs text-muted-foreground truncate">
              {location.city}
              {location.country && `, ${location.country}`}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "session.startDate",
    header: "Session Date",
    cell: ({ row }) => {
      const startDate = row.original.session?.startDate;
      if (!startDate) return <span className="text-xs sm:text-sm">N/A</span>;
      const date = new Date(startDate);
      return (
        <div className="text-xs sm:text-sm">
          <div className="sm:hidden">{format(date, "MMM dd")}</div>
          <div className="hidden sm:block">{format(date, "MMM dd, yyyy")}</div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => <AttendanceActionsDropdown attendance={row.original} />,
  },
];
