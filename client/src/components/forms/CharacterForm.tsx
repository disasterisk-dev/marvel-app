import { useCharacterForm } from "@/forms/useCharacterForm";
import { character, option } from "@/types";
import { useAdmin } from "@/context/AdminContext";

const CharacterForm = () => {
  // Pulling in details from the character form hook, contains validation and default values, and the submission method
  const { password, setOpen } = useAdmin()!;

  const form = useCharacterForm(password, () => setOpen(false));

  const initialActors: option[] = [];

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
              initialValues={initialActors}
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
  const characters = JSON.parse(sessionStorage.getItem("characters")!);

  const options: option[] = [];

  characters.forEach((c: character) => {
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
};
