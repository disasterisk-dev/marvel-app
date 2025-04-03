import { useQuery } from "@tanstack/react-query";
import { character } from "../types";
interface props {
  charFilter: number[];
  setCharFilter: (values: number[]) => void;
}
const CharacterFilters = ({ charFilter, setCharFilter }: props) => {
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

      data.items.sort((a: character, b: character) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );

      return data;
    },
  });
  return (
    <>
      <h2 className="font-semibold text-xl mt-2">Characters</h2>
      {characters.error && <div>{characters.error.message}</div>}
      {characters.data &&
        characters.data.items.map((c: character) => (
          <div className="flex gap-2" key={c.id}>
            <input
              type="checkbox"
              name={c.id.toString()}
              id={c.id.toString()}
              className=""
              value={c.id}
              onChange={(e) => updateFilter(parseInt(e.target.value))}
            />
            <label className="text-nowrap" htmlFor={c.id.toString()}>
              {c.name}
            </label>
          </div>
        ))}
    </>
  );
};

export default CharacterFilters;
