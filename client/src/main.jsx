import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// The single master stylesheet for every module.
import "./index.css";

import { installAxiosInterceptors } from "./services/axiosSetup";
import App from "./App.jsx";

// Routes every axios call in the app through the unified session
// and the dev proxy. Must run before the first request is made.
installAxiosInterceptors();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
