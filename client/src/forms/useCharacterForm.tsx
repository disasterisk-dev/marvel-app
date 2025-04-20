import axios from "axios";
import { toast } from "sonner";
import { useAppForm } from "./useAppForm";

export const useCharacterForm = (
  password: string | undefined,
  close: () => void,
) => {
  const form = useAppForm({
    defaultValues: {
      name: "",
      actors: [""],
    },
    validators: {
      onChange: ({ value }) => {
        if (value.name.split("").length === 0) {
          return "Name is required";
        }

        if (value.actors[0] === "") {
          return "At least 1 actor is required";
        }

        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      await axios
        .post(
          import.meta.env.VITE_API_BASE_URL + "/characters",
          { ...value },
          {
            headers: {
              Authorization: "Bearer " + password!,
            },
          },
        )
        .then((res) => {
          toast("Created New Character", res.data);
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
