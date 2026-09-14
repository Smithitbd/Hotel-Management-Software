import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import Router from "./router/Router.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StatusProvider from "./contexts/StatusProvider.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="font-urbanist mx-auto">
        <AuthProvider>
          <StatusProvider>
            <RouterProvider router={Router} />
          </StatusProvider>
        </AuthProvider>
      </div>
    </QueryClientProvider>
  </StrictMode>,
);
