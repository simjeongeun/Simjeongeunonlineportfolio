import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { MainPortfolio } from "./components/MainPortfolio";
import { DynamicModularProject } from "./components/projects/DynamicModularProject";
import { OsullocProject } from "./components/projects/OsullocProject";
import { FragmentsProject } from "./components/projects/FragmentsProject";
import { ReframeProject } from "./components/projects/ReframeProject";
import { SmartRefrigeratorProject } from "./components/projects/SmartRefrigeratorProject";
import { AquaSwarmProject } from "./components/projects/AquaSwarmProject";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <Navigate to="/" replace />,
    children: [
      {
        index: true,
        element: <MainPortfolio />,
      },
      {
        path: "projects/dynamic-modular",
        element: <DynamicModularProject />,
      },
      {
        path: "projects/osulloc",
        element: <OsullocProject />,
      },
      {
        path: "projects/fragments",
        element: <FragmentsProject />,
      },
      {
        path: "projects/reframe",
        element: <ReframeProject />,
      },
      {
        path: "projects/smart-refrigerator",
        element: <SmartRefrigeratorProject />,
      },
      {
        path: "projects/aquaswarm",
        element: <AquaSwarmProject />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);