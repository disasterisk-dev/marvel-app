import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen.ts";
import "./styles.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { FilterContextProvider } from "./context.ts/FilterContext.tsx";

const queryClient = new QueryClient();
const router = createRouter({ routeTree });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <FilterContextProvider>
        <RouterProvider router={router} />
      </FilterContextProvider>
    </QueryClientProvider>
  </StrictMode>,
);
