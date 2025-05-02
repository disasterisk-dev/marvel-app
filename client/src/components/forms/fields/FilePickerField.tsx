import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/forms/useAppForm";
import { faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type Props = {
  label: string;
  password: string;
};
export const FilePickerField = ({ label, password }: Props) => {
  const field = useFieldContext<string>();

  const mutation = useMutation({
    mutationKey: ["upload"],
    mutationFn: async (file: File) => {
      await axios
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
        .catch((err) => {
          throw new Error(err.message);
        });
    },
  });

  return (
    <>
      <Label htmlFor={field.name}>{label}</Label>
      <div className="flex items-stretch gap-2">
        <Input
          id={field.name}
          name={field.name}
          // value={field.state.value}
          onChange={(e) => mutation.mutateAsync(e.target.files![0])}
          type="file"
        />
        {mutation.isPending && (
          <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
        )}
        {mutation.isSuccess && (
          <FontAwesomeIcon
            className="text-chart-2 aspect-square h-full"
            icon={faCheckCircle}
          />
        )}
      </div>
      {mutation.isError && (
        <em className="text-destructive">{mutation.error.toString()}</em>
      )}
    </>
  );
};
