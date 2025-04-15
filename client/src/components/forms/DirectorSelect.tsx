import { entry } from "@/types";
import axios from "axios";
import AsyncCreatableSelect from "react-select/async-creatable";

// @ts-expect-error Can't be bothered
const DirectorSelect = ({ field }) => {
  return (
    <AsyncCreatableSelect
      isMulti
      cacheOptions={false}
      id={field.name}
      defaultOptions
      loadOptions={loadDirectors}
      onChange={(v) => {
        const values: string[] = [];
        v.forEach((i) => values.push(i.value));
        field.handleChange(values);
      }}
    />
  );
};

export default DirectorSelect;

interface directorOption {
  readonly value: string;
  readonly label: string;
}

const loadDirectors = (
  inputValue: string,
  callback: (options: directorOption[]) => void,
) => {
  axios.get(import.meta.env.VITE_API_BASE_URL + "/entries").then((res) => {
    const entries: entry[] = res.data.items;
    const directors: string[] = [];

    // Filter out duplicates first
    entries.forEach((e) => {
      e.directors.forEach((d) => {
        if (!directors.includes(d)) {
          directors.push(d);
        }
      });
    });

    // convert plain strings into options for the react-select library
    const options: directorOption[] = [];

    directors.forEach((d) => {
      options.push({ label: d, value: d });
    });

    callback(
      options.filter((o) =>
        o.value.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()),
      ),
    );
  });
};
