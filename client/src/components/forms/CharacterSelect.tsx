import { character } from "@/types";
import axios from "axios";
import AsyncSelect from "react-select/async";

// @ts-expect-error Can't be bothered
const CharacterSelect = ({ field }) => {
  return (
    <AsyncSelect
      isMulti
      id={field.name}
      cacheOptions={false}
      defaultOptions
      loadOptions={loadCharacters}
      onChange={(v) => {
        const values: number[] = [];
        v.forEach((i) => values.push(i.value));
        field.handleChange(values);
      }}
    />
  );
};

export default CharacterSelect;

interface characterOption {
  readonly value: number;
  readonly label: string;
}

const loadCharacters = (
  inputValue: string,
  callback: (options: characterOption[]) => void,
) => {
  axios.get(import.meta.env.VITE_API_BASE_URL + "/characters").then((res) => {
    const characters: character[] = res.data.items;

    const options: characterOption[] = [];

    characters.forEach((c) => {
      options.push({ label: c.name, value: c.id });
    });

    callback(
      options.filter((o) =>
        o.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()),
      ),
    );
  });
};
