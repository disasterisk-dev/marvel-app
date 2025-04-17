import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/forms/useAppForm";

type Props = {
  label: string;
};
export const FilePickerField = ({ label }: Props) => {
  const field = useFieldContext<string>();

  return (
    <>
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        // value={field.state.value}
        onChange={(e) => field.handleChange(e.target.files![0].name)}
        type="file"
      />
    </>
  );
};
