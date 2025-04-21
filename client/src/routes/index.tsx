import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const { data, isError } = useQuery({
    queryKey: ["about"],
    queryFn: async () => {
      const data = await axios
        .get(import.meta.env.VITE_API_BASE_URL + "/about")
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          throw new Error(error);
        });

      return data;
    },
  });

  return (
    <div className="bg-background flex h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-5xl font-black">Uatu IO</h1>
      {data && (
        <>
          <h2 className="text-muted-foreground max-w-prose text-2xl font-semibold">
            {data.movieCount} Movies, {data.episodeCount} episodes of{" "}
            {data.showCount} shows, and {data.extraCount} extras
          </h2>
          <h3 className="text-muted-foreground max-w-prose text-2xl font-semibold">
            {Math.ceil(data.totalRuntime / 60)} hours of Marvel
          </h3>
        </>
      )}
      <Button
        className="bg-brand text-foreground hover:text-background w-full max-w-screen-sm cursor-pointer text-xl font-bold md:w-1/2"
        onClick={() => navigate({ to: "/app" })}
      >
        Get Started
      </Button>
      {isError && <span>Oops</span>}
    </div>
  );
}
