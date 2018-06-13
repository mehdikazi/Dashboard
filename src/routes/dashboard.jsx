import DashboardPage from "../views/Dashboard/Dashboard.jsx";
import UserProfile from "../views/UserProfile/UserProfile.jsx";
import TableList from "../views/TableList/TableList.jsx";
import Typography from "../views/Typography/Typography.jsx";
import Icons from "../views/Icons/Icons.jsx";
import Maps from "../views/Maps/Maps.jsx";
import NotificationsPage from "../views/Notifications/Notifications.jsx";

import {
  Dashboard,
  Person,
  ContentPaste,
  LibraryBooks,
  BubbleChart,
  LocationOn,
  Notifications
} from "@material-ui/icons";

const dashboardRoutes = [
  {
    path: "/Dashboard",
    sidebarName: "Dashboard",
    navbarName: "FastWithMe Challenge Dashboard",
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: "/table",
    sidebarName: "Table List",
    navbarName: "Table List",
    icon: ContentPaste,
    component: TableList
  },
  { redirect: true, path: "/", to: "/Dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
