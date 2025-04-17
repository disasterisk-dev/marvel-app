import { useFieldContext } from "@/forms/useAppForm";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

type Props = {
  label: string;
};
export const TextField = ({ label }: Props) => {
  const field = useFieldContext<string>();
  return (
    <>
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        type="text"
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </>
  );
};
