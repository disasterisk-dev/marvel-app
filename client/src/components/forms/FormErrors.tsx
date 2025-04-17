import { useFormContext } from "@/forms/useAppForm";
import { useStore } from "@tanstack/react-form";

export const FormErrors = () => {
  const form = useFormContext();
  const formErrors = useStore(form.store, (state) => state.errorMap);
  return (
    <div>
      {formErrors.onChange ? (
        <div>
          <em className="text-destructive">{formErrors.onChange}</em>
        </div>
      ) : null}
    </div>
  );
};
