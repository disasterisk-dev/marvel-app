import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "@tanstack/react-form";
import { FieldInfo } from "./FieldInfo";

const EntryForm = () => {
  const form = useForm({
    defaultValues: {
      title: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
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
        name="title"
        validators={{
          onChange: ({ value }) =>
            value.split("").length > 0 ? undefined : "Title is required",
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
      <hr />
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) =>
            value.split("").length > 0
              ? undefined
              : "Admin password is required to create entries",
        }}
        children={(field) => {
          return (
            <>
              <Label htmlFor={field.name}>{field.name}</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                type="password"
                onChange={(e) => field.handleChange(e.target.value)}
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

export default EntryForm;
