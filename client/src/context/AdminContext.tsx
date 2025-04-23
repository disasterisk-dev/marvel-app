import { character, entry, episode } from "@/types";
import { createContext, ReactElement, useContext, useState } from "react";

interface adminTypes {
  open: boolean;
  setOpen: (value: boolean) => void;
  password: string | undefined;
  setPassword: (value: string | undefined) => void;
  edit: entry | episode | character | undefined;
  setEdit: (value: entry | episode | character | undefined) => void;
  tab: "entry" | "episode" | "character";
  setTab: (value: "entry" | "episode" | "character") => void;
}

const AdminContext = createContext<adminTypes | null>(null);

type Props = {
  children: ReactElement;
};

export const AdminProvider = ({ children }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [password, setPassword] = useState<string | undefined>(undefined);

  const [edit, setEdit] = useState<entry | episode | character | undefined>(
    undefined,
  );

  const [tab, setTab] = useState<"entry" | "episode" | "character">("entry");

  return (
    <AdminContext.Provider
      value={{
        open,
        setOpen,
        password,
        setPassword,
        edit,
        setEdit,
        tab,
        setTab,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (context === undefined) {
    throw new Error("Must use useAdmin inside the AdminProvider component");
  }

  return context;
};
