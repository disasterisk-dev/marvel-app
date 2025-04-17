import { DatePickerField } from "@/components/forms/fields/DatePickerField";
import { FilePickerField } from "@/components/forms/fields/FilePickerField";
import { NumberField } from "@/components/forms/fields/NumberField";
import { SelectAsync } from "@/components/forms/fields/SelectAsync";
import { SelectAsyncCreatable } from "@/components/forms/fields/SelectAsyncCreatable";
import { SelectField } from "@/components/forms/fields/SelectField";
import { SubmitButton } from "@/components/forms/fields/SubmitButton";
import { TextField } from "@/components/forms/fields/TextField";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

//   Registering components to be used in forms
export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    NumberField,
    DatePickerField,
    FilePickerField,
    SelectAsync,
    SelectAsyncCreatable,
    SelectField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
