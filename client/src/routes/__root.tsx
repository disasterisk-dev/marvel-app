import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: NotFound,
});

function Root() {
  return (
    <React.Fragment>
      <div className="bg-inverse-subtle text-bold grow min-h-screen flex flex-col">
        <header className="font-heading flex gap-2 p-2 items-center text-bold bg-inverse sticky top-0 z-50">
          <Link to={"/app"}>
            <h1 className="grow text-2xl font-bold">Uatu the Rewatcher</h1>
          </Link>
        </header>
        <main className="p-4 grow">
          <Outlet />
        </main>
      </div>
      <footer className="bg-bold text-inverse p-4 text-center">test</footer>
    </React.Fragment>
  );
}

function NotFound() {
  return <div>Not Found</div>;
}
