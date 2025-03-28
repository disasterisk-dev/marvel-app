import Elysia from "elysia";

export const episodesRoute = new Elysia({ prefix: "/episodes" })
  .get("/:id", ({ params }) => {
    // Returns a single episode by the ID
  })
  .get("/from/:id", ({ params }) => {
    // gets episodes from a specific show, via the show ID
  });
