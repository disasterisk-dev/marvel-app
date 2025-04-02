import { useQuery } from "@tanstack/react-query";
import { pageTopRef } from "../routes/__root";
interface props {
  charFilter: number[];
  setCharFilter: (values: number[]) => void;
}
const Filters = ({ charFilter, setCharFilter }: props) => {
  function updateFilter(id: number) {
    if (charFilter.includes(id)) {
      const newFilter = charFilter.filter((c) => c !== id);
      setCharFilter(newFilter);
      console.log(charFilter);

      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For everyone else

      return;
    }

    setCharFilter([...charFilter, id]);

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For everyone else

    return;
  }

  const characters = useQuery({
    queryKey: ["characters"],
    queryFn: async () => {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/characters"
      );

      if (!res.ok) {
        throw new Error("Couldn't get characters");
      }

      const data = await res.json();

      data.items.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );

      return data;
    },
  });
  return (
    <aside>
      {characters.error && <div>{characters.error.message}</div>}
      {characters.data &&
        characters.data.items.map((c) => (
          <div className="flex gap-2" key={c.id}>
            <input
              type="checkbox"
              name={c.id}
              id={c.id}
              className=""
              value={c.id}
              onChange={(e) => updateFilter(parseInt(e.target.value))}
            />
            <label htmlFor={c.id}>{c.name}</label>
          </div>
        ))}
    </aside>
  );
};

export default Filters;
