import { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye as eyeSolid } from "@fortawesome/free-solid-svg-icons";
import { faEye as eyeRegular } from "@fortawesome/free-regular-svg-icons";

type Props = {
  state: string | undefined;
  method: (value: string | undefined) => void;
};
export const PasswordField = ({ state, method }: Props) => {
  const [type, setType] = useState<"password" | "text">("password");

  const toggleType = () => setType(type === "password" ? "text" : "password");

  return (
    <div className="flex w-full gap-2">
      <Input
        className="grow"
        id="password"
        type={type}
        value={state}
        onChange={(e) => method(e.target!.value)}
      />
      <Button className="aspect-square" onClick={toggleType}>
        <FontAwesomeIcon icon={type == "password" ? eyeRegular : eyeSolid} />
      </Button>
    </div>
  );
};
