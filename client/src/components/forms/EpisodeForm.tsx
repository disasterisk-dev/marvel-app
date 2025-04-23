import { useAdmin } from "@/context/AdminContext";
import { useEpisodeForm } from "@/forms/useEpisodeForm";
import { entry, episode, option } from "@/types";
import axios from "axios";

export const EpisodeForm = () => {
  const { edit, setEdit } = useAdmin()!;
  const { password, setOpen } = useAdmin()!;

  const form = useEpisodeForm(edit as episode, password, () => {
    setOpen(false);
    setEdit(undefined);
  });

  const initialDirectors: option[] = [];
  let initialSeries: option;

  if (edit) {
    form.getFieldValue("directors").forEach((d) => {
      initialDirectors.push({ label: d, value: d });
    });

    const series: entry = JSON.parse(localStorage.getItem("shows")!).find(
      (s: entry) => s.id === form.getFieldValue("series"),
    );

    initialSeries = { label: series.title, value: series.id };
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
          name="runtime"
          children={(field) => (
            <field.NumberField label="Runtime (in minutes)" min={0} />
          )}
        />
        <form.AppField
          name="series"
          children={(field) => (
            <field.SelectAsync
              label="Series"
              isMulti={false}
              loadMethod={loadSeries}
              initialValues={initialSeries}
            />
          )}
        />
        <form.AppField
          name="episodeNumber"
          children={(field) => (
            <field.NumberField label="Episode number (in season)" min={1} />
          )}
        />
        <form.SubmitButton label="Create Episode" />
        <form.FormErrors />
      </div>
    </form.AppForm>
  );
};

const loadDirectors = (
  inputValue: string,
  callback: (options: option[]) => void,
) => {
  axios.get(import.meta.env.VITE_API_BASE_URL + "/episodes").then((res) => {
    const episodes: episode[] = res.data.items;

    const directors: string[] = [];

    // Filter out duplicates first
    episodes.forEach((e) => {
      e.directors.forEach((d) => {
        if (!directors.includes(d.trim())) {
          directors.push(d.trim());
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
        o.label
          .toString()
          .toLocaleLowerCase()
          .includes(inputValue.toLocaleLowerCase()),
      ),
    );
  });
};

const loadSeries = (
  inputValue: string,
  callback: (options: option[]) => void,
) => {
  axios
    .get(import.meta.env.VITE_API_BASE_URL + "/entries?medium=Show")
    .then((res) => {
      const entries: entry[] = res.data.items;

      const options: option[] = [];

      entries.forEach((e) => {
        const newOption: option = { label: e.title, value: e.id };

        if (!options.includes(newOption)) {
          options.push(newOption);
        }
      });

      callback(
        options
          .filter((o) =>
            o.label
              .toString()
              .toLocaleLowerCase()
              .includes(inputValue.toLocaleLowerCase()),
          )
          .sort((a: option, b: option) =>
            a.label.toLowerCase().localeCompare(b.label.toLowerCase()),
          ),
      );
    });
};
