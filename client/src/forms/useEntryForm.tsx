import { toast } from "sonner";
import { useAppForm } from "./useAppForm";
import axios from "axios";

export const useEntryForm = (
  password: string | undefined,
  close: () => void,
) => {
  const form = useAppForm({
    defaultValues: {
      title: "",
      releaseDate: "",
      directors: [""],
      medium: "Movie",
      runtime: 0,
      posterUrl: "",
      characters: [0],
      phase: 1,
    },
    validators: {
      onChange: ({ value }) => {
        console.log(value);

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

        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      await axios
        .post(
          import.meta.env.VITE_API_BASE_URL + "/entries",
          { ...value },
          {
            headers: {
              Authorization: "Bearer " + password!,
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

      close();
    },
  });

  return form;
};
