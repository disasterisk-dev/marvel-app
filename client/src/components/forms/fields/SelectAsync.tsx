import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/forms/useAppForm";
import { cn } from "@/lib/utils";
import { option } from "@/types";
import AsyncSelect from "react-select/async";

type Props = {
  label: string;
  isMulti?: boolean;
  loadMethod: (
    inputValue: string,
    callback: (options: option[]) => void,
  ) => void;
  initialValues: option | option[];
};
export const SelectAsync = ({
  label,
  isMulti = true,
  loadMethod,
  initialValues,
}: Props) => {
  const field = useFieldContext<number[]>();
  return (
    <>
      <Label htmlFor={field.name}>{label}</Label>
      <AsyncSelect
        classNames={{
          control: () =>
            cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-muted-foreground",
            ),
          valueContainer: () => "flex gap-2 text-foreground",
          multiValue: () =>
            "bg-input px-2 py-1 rounded-sm flex items-center gap-2",
          menuList: () => "bg-background border border-input rounded-md",
          option: () =>
            "px-2 py-1 hover:bg-muted m-1 border-sm w-min rounded-sm text-sm",
        }}
        unstyled
        isMulti={isMulti}
        id={field.name}
        cacheOptions={false}
        defaultOptions
        loadOptions={loadMethod}
        onChange={(v) => {
          if (isMulti) {
            const values: number[] = [];
            //   @ts-expect-error - Doesn't like taking a union type, deal with it
            v.forEach((i) => values.push(i.value));
            field.handleChange(values);
            return;
          }

          // @ts-expect-error - This will be caught by validators
          field.handleChange(v.value);
        }}
        defaultValue={initialValues}
      />
    </>
  );
};
