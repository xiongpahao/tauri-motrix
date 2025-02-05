import {
  ConstructionRounded,
  DoneRounded,
  HistoryRounded,
  PlayArrowRounded,
  SettingsRounded,
} from "@mui/icons-material";
import { ReactNode } from "react";
import { Navigate, RouteObject } from "react-router-dom";

import SettingsPage from "@/pages/Settings";
import TaskActivePage from "@/pages/TaskStart";
import TaskStoppedPage from "@/pages/TaskDone";
import TaskHistoryPage from "@/pages/TaskHistory";
import AdvancedPage from "@/pages/Advanced";

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
    element: <TaskActivePage />,
  },
  {
    label: "Label-Task-Done",
    path: "/task-done",
    icon: <DoneRounded />,
    element: <TaskStoppedPage />,
  },
  {
    label: "Label-Task-History",
    path: "/task-history",
    icon: <HistoryRounded />,
    element: <TaskHistoryPage />,
  },
  {
    label: "Label-Settings",
    path: "/settings",
    icon: <SettingsRounded />,
    element: <SettingsPage />,
  },
  {
    label: "Label-Advanced",
    path: "/advanced",
    icon: <ConstructionRounded />,
    element: <AdvancedPage />,
  },
];
