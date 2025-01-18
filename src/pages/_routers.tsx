import PreferencePage from "@/pages/Preference";
import TaskPage from "@/pages/Task";

export const routers = [
  {
    label: "Label-Task",
    path: "/",
    icon: "",
    element: <TaskPage />,
  },
  {
    label: "Label-Preference",
    path: "/preference",
    icon: "",
    element: <PreferencePage />,
  },
];
