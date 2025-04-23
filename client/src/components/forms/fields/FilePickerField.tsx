import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/forms/useAppForm";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type Props = {
  label: string;
  password: string;
};
export const FilePickerField = ({ label, password }: Props) => {
  const field = useFieldContext<string>();

  const [file, setFile] = useState<File | null>(null);

  useQuery({
    queryKey: ["upload"],
    queryFn: () => {
      axios
        .post(
          import.meta.env.VITE_API_BASE_URL + "/upload",
          {
            file: file,
          },
          {
            headers: {
              Authorization: "Bearer " + password!,
              "Content-Type": "multipart/form-data",
            },
          },
        )
        .then((res) => {
          console.log(res.data);
          field.handleChange(res.data.url);
          return res.data;
        })
        .catch(() => {
          throw new Error("Couldn't upload");
        });
    },
    enabled: !!file,
  });

  return (
    <>
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        // value={field.state.value}
        onChange={(e) => setFile(e.target.files![0])}
        type="file"
      />
    </>
  );
};
