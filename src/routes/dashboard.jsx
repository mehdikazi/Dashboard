import DashboardPage from "../views/Dashboard/Dashboard.jsx";
import TableList from "../views/TableList/TableList.jsx";

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
