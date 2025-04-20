import axios from "axios";
import { useAppForm } from "./useAppForm";
import { toast } from "sonner";

export const useEpisodeForm = (
  password: string | undefined,
  close: () => void,
) => {
  const form = useAppForm({
    defaultValues: {
      title: "",
      releaseDate: "",
      directors: [""],
      runtime: 0,
      series: 0,
      episodeNumber: 1,
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
        if (value.runtime === 0) {
          return "Runtime cannot be 0";
        }

        if (!value.runtime && value.runtime !== 0) {
          return "A runtime is needed";
        }

        // Characters validators
        if (value.series === 0 || !value.series) {
          return "Series is required";
        }

        // Episode number validators
        if (value.episodeNumber === 0) {
          return "Runtime cannot be 0";
        }

        if (!value.episodeNumber && value.episodeNumber !== 0) {
          return "A runtime is needed";
        }

        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      // post request
      await axios
        .post(
          import.meta.env.VITE_API_BASE_URL + "/episodes",
          { ...value },
          {
            headers: {
              Authorization: "Bearer " + password!,
            },
          },
        )
        .then((res) => {
          toast("Created New Episode", res.data);
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
