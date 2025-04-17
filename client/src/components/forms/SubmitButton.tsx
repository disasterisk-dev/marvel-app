import { Button } from "@/components/ui/button";
import { useFormContext } from "@/forms/useAppForm";

type Props = {
  label: string;
};
export const SubmitButton = ({ label }: Props) => {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => (
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          type="submit"
          disabled={!canSubmit}
        >
          {isSubmitting ? "..." : label}
        </Button>
      )}
    />
  );
};
