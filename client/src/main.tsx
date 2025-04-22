import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen.ts";
import "./styles.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { FilterContextProvider } from "./context/FilterContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { ListProvider } from "./context/ListContext.tsx";

const queryClient = new QueryClient();
const router = createRouter({ routeTree });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ListProvider>
        <FilterContextProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </FilterContextProvider>
      </ListProvider>
    </QueryClientProvider>
  </StrictMode>,
);
