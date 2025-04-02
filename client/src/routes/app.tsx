import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: App,
});

function App() {
  const entries = useQuery({
    queryKey: ["entries"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/entries");

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();

      // Sort the entries by release date instead of ID
      data.items.sort(
        (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)
      );

      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {entries.data && (
        <div className="grid grid-cols-4 gap-2 max-w-screen-lg mx-auto">
          {entries.data.items.map((e) => (
            <div
              className="bg-inverse text-bold rounded-md overflow-hidden"
              key={e.id}
            >
              <img src={e.posterUrl} alt="" />
              {e.title}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
