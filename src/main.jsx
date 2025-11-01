import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import Routes from "./routes";
import ErrorBoundary from "./lib/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const client = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={client}>
        <AuthProvider>
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
              className: "",
              duration: 5000,
            }}
          />
          <Routes />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
