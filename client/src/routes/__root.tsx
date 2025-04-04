import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: NotFound,
});

function Root() {
  return (
    <React.Fragment>
      <div className="bg-inverse-subtle text-bold flex min-h-screen grow flex-col">
        <header className="font-heading text-inverse bg-brand-300 sticky top-0 z-50 flex items-center gap-2 p-4">
          <h1 className="grow text-2xl font-bold">Uatu IO</h1>
          <a
            href="https://github.com/disasterisk-dev/marvel-app"
            target="_blank"
          >
            <FontAwesomeIcon icon={faGithub} className="text-2xl" />
          </a>
        </header>
        <div id="top"></div>
        <main className="grow overflow-scroll p-4">
          <Outlet />
        </main>
      </div>
    </React.Fragment>
  );
}

function NotFound() {
  return <div>Not Found</div>;
}
