import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFieldContext } from "@/forms/useAppForm";
import { option } from "@/types";

type Props = {
  label: string;
  options: option[];
};
export const SelectField = ({ label, options }: Props) => {
  const field = useFieldContext<string>();

  return (
    <>
      <Label htmlFor={field.name}>{label}</Label>
      <Select
        defaultValue={field.state.value}
        value={field.state.value}
        onValueChange={field.handleChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((o) => (
              <SelectItem value={o.value.toString()}>{o.label}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};
