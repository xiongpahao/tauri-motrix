import PreferencePage from "@/pages/Preference";
import TaskPage from "@/pages/Task";
import {
  ConstructionRounded,
  PauseRounded,
  PlayArrowRounded,
  SettingsRounded,
  StopRounded,
} from "@mui/icons-material";
import { ReactNode } from "react";
import { Navigate, RouteObject } from "react-router-dom";

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
    element: <TaskPage />,
  },
  {
    label: "Label-Task-Waiting",
    path: "/task-waiting",
    icon: <PauseRounded />,
    element: <TaskPage />,
  },
  {
    label: "Label-Task-Stopped",
    path: "/task-stopped",
    icon: <StopRounded />,
    element: <TaskPage />,
  },
  {
    label: "Label-Setting",
    path: "/setting",
    icon: <SettingsRounded />,
    element: <PreferencePage />,
  },
  {
    label: "Label-Advanced",
    path: "/advanced",
    icon: <ConstructionRounded />,
    element: <PreferencePage />,
  },
];
