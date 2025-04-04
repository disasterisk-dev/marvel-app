interface props {
  state: string[];
  method: (values: string[]) => void;
}

const MediumFilters = ({ state, method }: props) => {
  const media = ["Movie", "Show", "Extra"];

  function updateFilter(e: string) {
    if (state.includes(e)) {
      const newFilter = state.filter((m: string) => m !== e);
      method(newFilter);

      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For everyone else

      return;
    }

    method([...state, e]);
  }

  return (
    <>
      <h2 className="text-xl font-semibold">Format</h2>
      {media.map((m, i) => (
        <div className="flex gap-2" key={i}>
          <input
            type="checkbox"
            name={m}
            id={m}
            className=""
            value={m}
            onChange={(e) => updateFilter(e.target.value)}
          />
          <label htmlFor={m}>{m}</label>
        </div>
      ))}
    </>
  );
};

export default MediumFilters;
