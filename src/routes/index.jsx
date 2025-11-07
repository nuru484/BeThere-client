//src/routes/index.jsx
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import LoginPage from "@/pages/LoginPage";
import ErrorPage from "@/pages/ErrorPage";
import Layout from "@/components/Layout";
import CreateEventPage from "@/pages/dashboard/events/CreateEventPage";
import UpdateEventPage from "@/pages/dashboard/events/UpdateEventPage";
import EventsPage from "@/pages/dashboard/events/EventsPage";
import Event from "@/components/event/Event";
import AddUserFaceScan from "@/pages/AddUserFaceScan";
import AttendanceIn from "@/pages/AttendanceIn";
import AttendanceOut from "@/pages/AttendanceOut";
import EventAttendancePage from "@/pages/EventAttendancePage";
import UserAttendancePage from "@/pages/UserAttendancePage";
import UserEventAttendancePage from "@/pages/UserEventAttendancePage";
import UsersManagePage from "@/pages/dashboard/users/UsersManagePage";
import CreateUserPage from "@/pages/dashboard/users/CreateUserPage";
import EditUserPage from "@/pages/dashboard/users/EditUserPage";
import DashboardRedirect from "@/pages/dashboard/DashboardRedirect";

const Routes = () => {
  const protectedRoutes = [
    {
      path: "/",
      element: <ProtectedRoutes />,
      children: [
        {
          path: "/dashboard",
          element: <Layout />,
          errorElement: <ErrorPage />,
          children: [
            { index: true, element: <DashboardRedirect /> },
            {
              path: "/dashboard/events",
              element: <EventsPage />,
            },
            {
              path: "/dashboard/events/:eventId",
              element: <Event />,
            },
            {
              path: "/dashboard/events/create",
              element: <CreateEventPage />,
            },
            {
              path: "/dashboard/events/update/:eventId",
              element: <UpdateEventPage />,
            },
            {
              path: "/dashboard/events/:eventId/attendance",
              element: <EventAttendancePage />,
            },
            {
              path: "/dashboard/attendance/user/:userId/event/:eventId",
              element: <UserEventAttendancePage />,
            },
            {
              path: "/dashboard/attendance",
              element: <UserAttendancePage />,
            },
            {
              path: "/dashboard/users",
              element: <UsersManagePage />,
            },
            {
              path: "/dashboard/users/create",
              element: <CreateUserPage />,
            },
            {
              path: "/dashboard/users/:userId/edit",
              element: <EditUserPage />,
            },
            {
              path: "/dashboard/add-facescan",
              element: <AddUserFaceScan />,
            },
            {
              path: "/dashboard/events/:eventId/attendance-in",
              element: <AttendanceIn />,
            },
            {
              path: "/dashboard/eventS/:eventId/attendance-out",
              element: <AttendanceOut />,
            },
          ],
        },
      ],
    },
  ];

  const publicRoutes = [
    {
      path: "/",
      element: <LoginPage />,
      errorElement: <ErrorPage />,
    },

    {
      path: "/login",
      element: <LoginPage />,
    },
  ];

  const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

  return <RouterProvider router={router} />;
};

export default Routes;
