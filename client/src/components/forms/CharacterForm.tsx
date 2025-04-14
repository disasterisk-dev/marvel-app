import { useForm } from "@tanstack/react-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FieldInfo } from "./FieldInfo";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";

type Props = {
  password: string | undefined;
  close: () => void;
};

const CharacterForm = ({ password, close }: Props) => {
  const form = useForm({
    defaultValues: {
      name: "",
      actors: [""],
    },
    onSubmit: async ({ value }) => {
      value.actors.forEach((v) => {
        return v.trim();
      });

      await axios
        .post(
          import.meta.env.VITE_API_BASE_URL + "/characters?",
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
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            value.split("").length > 0 ? undefined : "Name is required",
        }}
        children={(field) => {
          return (
            <>
              <Label htmlFor={field.name}>{field.name}</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                type="text"
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          );
        }}
      />
      <form.Field
        name="actors"
        validators={{
          onChange: ({ value }) => {
            if (value.length === 0) return "At least 1 actor is required";
            if (value[0].split.length === 0)
              return "At least 1 actor is required";
          },
        }}
        children={(field) => {
          return (
            <>
              <Label htmlFor={field.name}>{field.name} (Comma separated)</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                type="text"
                onChange={(e) => field.handleChange(e.target.value.split(/,/))}
              />
              <FieldInfo field={field} />
            </>
          );
        }}
      />
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "..." : "Submit"}
          </Button>
        )}
      />
    </form>
  );
};

export default CharacterForm;
