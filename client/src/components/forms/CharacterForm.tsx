import { useCharacterForm } from "@/forms/useCharacterForm";
import axios from "axios";
import { character, option } from "@/types";

type Props = {
  password: string | undefined;
  close: () => void;
};

const CharacterForm = ({ password, close }: Props) => {
  // Pulling in details from the character form hook, contains validation and default values, and the submission method
  const form = useCharacterForm(password, close);

  return (
    <form.AppForm>
      <div className="flex flex-col gap-2">
        <form.AppField
          name="name"
          children={(field) => <field.TextField label="Character Name" />}
        />
        <form.AppField
          name="actors"
          children={(field) => (
            <field.SelectAsyncCreatable
              label="Actors"
              loadMethod={loadActors}
            />
          )}
        />
        <form.SubmitButton label="Create Character" />
        <form.FormErrors />
      </div>
    </form.AppForm>
  );
};

export default CharacterForm;

const loadActors = (
  inputValue: string,
  callback: (options: option[]) => void,
) => {
  axios.get(import.meta.env.VITE_API_BASE_URL + "/characters").then((res) => {
    const characters: character[] = res.data.items;

    const options: option[] = [];

    characters.forEach((c) => {
      c.actors.forEach((a) => {
        const newOption = { label: a, value: a };
        if (!options.includes(newOption)) {
          options.push(newOption);
        }
      });
    });

    callback(
      options.filter((o) =>
        o.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()),
      ),
    );
  });
};
