import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./contexts/AuthContext";

// Create a query cache with a global error handler
const queryCache = new QueryCache({
  onError: (error) => {
    console.error("A global query error occurred:", error);
  },
});

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 300_000,   // 5 minutes
      gcTime: 600_000
    },
    mutations: {
      retry: false               // no extra POST attempts
    }
  },
  queryCache, // Pass the queryCache instance here
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={qc}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
