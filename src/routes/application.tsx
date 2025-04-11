import {
  DoneRounded,
  // HistoryRounded,
  PlayArrowRounded,
  // RecyclingRounded,
  SettingsRounded,
} from "@mui/icons-material";
import { ReactNode } from "react";
import { Navigate, RouteObject } from "react-router-dom";

import SettingsPage from "@/pages/Settings";
import TaskStoppedPage from "@/pages/TaskDone";
// import TaskHistoryPage from "@/pages/TaskHistory";
// import TaskRecyclePage from "@/pages/TaskRecycle";
import TaskStartPage from "@/pages/TaskStart";

type IRoute = RouteObject & { label?: string; icon?: ReactNode };

export const routers: IRoute[] = [
  {
    path: "/",
    element: <Navigate to="/task-start" />,
  },
  {
    label: "Label-Task-Active",
    path: "/task-start",
    icon: <PlayArrowRounded />,
    element: <TaskStartPage />,
  },
  {
    label: "Label-Task-Done",
    path: "/task-done",
    icon: <DoneRounded />,
    element: <TaskStoppedPage />,
  },
  // {
  //   label: "Label-Task-History",
  //   path: "/task-history",
  //   icon: <HistoryRounded />,
  //   element: <TaskHistoryPage />,
  // },
  // {
  //   label: "Label-Task-Recycle",
  //   path: "/task-recycle",
  //   icon: <RecyclingRounded />,
  //   element: <TaskRecyclePage />,
  // },
  {
    label: "Label-Settings",
    path: "/settings",
    icon: <SettingsRounded />,
    element: <SettingsPage />,
  },
];
