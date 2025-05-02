import { useAdmin } from "@/context/AdminContext";
import { useEntryForm } from "@/forms/useEntryForm";
import { character, entry, option } from "@/types";
import axios from "axios";

const EntryForm = () => {
  const { edit, setEdit } = useAdmin()!;
  const { password, setOpen } = useAdmin()!;

  const form = useEntryForm(edit as entry, password, () => {
    setOpen(false);
    setEdit(undefined);
  });

  const initialDirectors: option[] = [];
  const initialCharacters: option[] = [];

  if (edit) {
    form.getFieldValue("directors").forEach((d) => {
      initialDirectors.push({ label: d, value: d });
    });

    const characters = JSON.parse(sessionStorage.getItem("characters")!);

    form.getFieldValue("characters").forEach((c) => {
      const character: character = characters.find(
        (char: character) => char.id === c,
      );

      if (character) {
        initialCharacters.push({ label: character.name, value: character.id });
      }
    });
  }

  return (
    <form.AppForm>
      <div className="flex flex-col gap-2">
        <form.AppField
          name="title"
          children={(field) => <field.TextField label="Title" />}
        />
        <form.AppField
          name="releaseDate"
          children={(field) => <field.DatePickerField label="Release Date" />}
        />
        <form.AppField
          name="directors"
          children={(field) => (
            <field.SelectAsyncCreatable
              label="Director(s)"
              loadMethod={loadDirectors}
              initialValues={initialDirectors}
            />
          )}
        />
        <form.AppField
          name="medium"
          children={(field) => (
            <field.SelectField label="Format" options={mediumOptions} />
          )}
        />
        <form.AppField
          name="runtime"
          children={(field) => (
            <field.NumberField label="Runtime (in minutes)" />
          )}
        />
        <form.AppField
          name="posterUrl"
          children={(field) => (
            <field.FilePickerField password={password!} label="Poster" />
          )}
        />
        <form.AppField
          name="characters"
          children={(field) => (
            <field.SelectAsync
              label="Characters"
              loadMethod={loadCharacters}
              initialValues={initialCharacters}
            />
          )}
        />
        <form.AppField
          name="phase"
          children={(field) => (
            <field.NumberField label="Phase (1-6)" min={1} max={6} />
          )}
        />
        <form.SubmitButton label="Create Entry" />
        <form.FormErrors />
      </div>
    </form.AppForm>
  );
};

export default EntryForm;

const mediumOptions: option[] = [
  { value: "Movie", label: "Movie" },
  { value: "Show", label: "Show" },
  { value: "Extra", label: "Extra" },
];

const loadDirectors = (
  inputValue: string,
  callback: (options: option[]) => void,
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
    const options: option[] = [];

    directors.forEach((d) => {
      options.push({ label: d, value: d });
    });

    callback(
      options.filter((o) =>
        o.value
          .toString()
          .toLocaleLowerCase()
          .includes(inputValue.toLocaleLowerCase()),
      ),
    );
  });
};

const loadCharacters = (
  inputValue: string,
  callback: (options: option[]) => void,
) => {
  // axios.get(import.meta.env.VITE_API_BASE_URL + "/characters").then((res) => {
  //   const characters: character[] = res.data.items;

  //   const options: option[] = [];

  //   characters.forEach((c) => {
  //     options.push({ label: c.name, value: c.id });
  //   });

  const characters = JSON.parse(sessionStorage.getItem("characters")!);
  const options: option[] = [];

  characters.forEach((c: character) => {
    options.push({ label: c.name, value: c.id });
  });

  callback(
    options.filter((o) =>
      o.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()),
    ),
  );
};
