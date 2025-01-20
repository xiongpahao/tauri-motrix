import {
  ConstructionRounded,
  PauseRounded,
  PlayArrowRounded,
  SettingsRounded,
  StopRounded,
} from "@mui/icons-material";
import { ReactNode } from "react";
import { Navigate, RouteObject } from "react-router-dom";

import SettingsPage from "@/pages/Settings";
import TaskActivePage from "@/pages/TaskStart";
import TaskStoppedPage from "@/pages/TaskStopped";
import TaskWaitingPage from "@/pages/TaskWaiting";
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
    label: "Label-Task-Waiting",
    path: "/task-waiting",
    icon: <PauseRounded />,
    element: <TaskWaitingPage />,
  },
  {
    label: "Label-Task-Stopped",
    path: "/task-stopped",
    icon: <StopRounded />,
    element: <TaskStoppedPage />,
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
