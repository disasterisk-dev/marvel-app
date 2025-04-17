import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/forms/useAppForm";

type Props = {
  label: string;
  min?: number | undefined;
  max?: number | undefined;
};
export const NumberField = ({ label, min, max }: Props) => {
  const field = useFieldContext<number>();

  return (
    <>
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        type="number"
        value={field.state.value}
        onChange={(e) => field.handleChange(parseInt(e.target.value))}
        min={min}
        max={max}
      />
    </>
  );
};
