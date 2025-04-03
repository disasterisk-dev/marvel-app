import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: NotFound,
});

function Root() {
  return (
    <React.Fragment>
      <div className="bg-inverse-subtle text-bold grow min-h-screen flex flex-col">
        <header className="font-heading flex gap-2 p-4 items-center text-inverse bg-brand-300 sticky top-0 z-50">
          <Link to={"/app"} className="grow">
            <h1 className="text-2xl font-bold">Uatu IO</h1>
          </Link>
          <a
            href="https://github.com/disasterisk-dev/marvel-app"
            target="_blank"
          >
            <FontAwesomeIcon icon={faGithub} className="text-2xl" />
          </a>
        </header>
        <div id="top"></div>
        <main className="p-4 grow overflow-scroll">
          <Outlet />
        </main>
      </div>
    </React.Fragment>
  );
}

function NotFound() {
  return <div>Not Found</div>;
}
