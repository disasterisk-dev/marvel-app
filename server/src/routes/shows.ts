import Elysia from "elysia";

export const showsRoute = new Elysia({ prefix: "/shows" })
  .get("/", () => {
    // return all shows
  })
  .get("/:id", ({ params }) => {
    // return specific show
    // fetch episode overviews
  });
