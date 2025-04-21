import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import AdminPanel from "@/components/admin";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: NotFound,
});

function Root() {
  return (
    <React.Fragment>
      <Outlet />
      <AdminPanel />
      <Toaster />
    </React.Fragment>
  );
}

function NotFound() {
  return <div>Not Found</div>;
}
