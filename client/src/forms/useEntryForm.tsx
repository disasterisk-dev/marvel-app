import { toast } from "sonner";
import { useAppForm } from "./useAppForm";
import axios from "axios";
import { entry } from "@/types";

export const useEntryForm = (
  initial: entry = {
    id: 0,
    title: "",
    releaseDate: new Date(),
    directors: [""],
    medium: "Movie",
    runtime: 0,
    posterUrl: "",
    characters: [0],
    phase: 1,
  },
  password: string | undefined,
  close: () => void,
) => {
  const form = useAppForm({
    defaultValues: {
      title: initial.title,
      releaseDate: initial.releaseDate.toString(),
      directors: initial.directors,
      medium: initial.medium,
      runtime: initial.runtime,
      posterUrl:
        initial.posterUrl.split("/")[initial.posterUrl.split("/").length - 1],
      characters: initial.characters,
      phase: initial.phase,
    },
    validators: {
      onChange: ({ value }) => {
        // Title validators
        if (value.title.split("").length === 0) {
          return "Title is required";
        }

        // Release date validators
        if (new Date(value.releaseDate).toDateString() == "Invalid Date")
          return "A date is required";

        if (new Date(value.releaseDate) > new Date())
          return "Future dates are not allowed";

        // Directors validators
        if (value.directors[0] === "" || value.directors.length === 0) {
          return "At least one director or showrunner is needed.";
        }

        // Runtime validators
        if (value.runtime === 0 && value.medium !== "Show") {
          return (
            "Runtime is needed for " + value.medium.toLocaleLowerCase() + "s"
          );
        }

        if (value.runtime !== 0 && value.medium === "Show") {
          return "Runtime should be 0 for shows (its calculated by the episode runtimes)";
        }

        if (!value.runtime && value.runtime !== 0) {
          return "A runtime is needed";
        }

        // Poster URL validators
        if (value.posterUrl.split("").length === 0) {
          return "A poster is required (Make sure to upload it!)";
        }

        // Characters validators
        if (value.characters[0] === 0 || value.characters.length === 0) {
          return (
            "At least one character is needed, is no one in this " +
            value.medium.toLocaleLowerCase() +
            "?"
          );
        }

        // Phase validators
        if (!value.phase && value.phase !== 0) {
          return "Phase is needed";
        }

        if (!password) {
          return "Don't forget the super secret key!";
        }

        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      if (initial.id > 0) {
        updateEntry(value, initial.id, password!);
      } else {
        createEntry(value, password!);
      }

      close();
    },
  });

  return form;
};

async function createEntry(value, password: string) {
  await axios
    .post(
      import.meta.env.VITE_API_BASE_URL + "/entries",
      { ...value },
      {
        headers: {
          Authorization: "Bearer " + password,
        },
      },
    )
    .then((res) => {
      toast("Created New Entry", res.data);
    })
    .catch((err) => {
      toast("Something went wrong", {
        description: err.message,
        action: {
          label: "More",
          onClick: () => console.log(err),
        },
      });
    });
}

async function updateEntry(value, id: number, password: string) {
  await axios
    .put(
      import.meta.env.VITE_API_BASE_URL + "/entries/" + id,
      { ...value },
      {
        headers: {
          Authorization: "Bearer " + password,
        },
      },
    )
    .then((res) => {
      toast("Updated entry", res.data);
    })
    .catch((err) => {
      toast("Something went wrong", {
        description: err.message,
        action: {
          label: "More",
          onClick: () => console.log(err),
        },
      });
    });
}
