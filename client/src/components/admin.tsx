import EntryForm from "@/components/forms/EntryForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import CharacterForm from "./forms/CharacterForm";
import { Label } from "./ui/label";
import { PasswordField } from "./forms/fields/PasswordField";
import { EpisodeForm } from "./forms/EpisodeForm";
import { ScrollArea } from "./ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { useAdmin } from "@/context/AdminContext";

const AdminPanel = () => {
  const { open, setOpen, tab, setTab, setEdit, password, setPassword } =
    useAdmin()!;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setEdit(undefined);
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen, setEdit]);

  return (
    <>
      <Sheet key={"right"} open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Admin Panel</SheetTitle>
            <SheetDescription>
              This super secret panel is only for use by the admin, you can't
              create new entries without the super secret key!
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="mx-2 h-full overflow-scroll pr-4">
            <Tabs
              defaultValue={tab}
              // @ts-expect-error - Possible values can all be accpeted by the union type
              onValueChange={(v) => setTab(v)}
              className="h-min w-full"
            >
              <TabsList>
                <TabsTrigger value="entry">Entry</TabsTrigger>
                <TabsTrigger value="character">Character</TabsTrigger>
                <TabsTrigger value="episode">Episode</TabsTrigger>
              </TabsList>
              <TabsContent value="entry">
                <EntryForm />
              </TabsContent>
              <TabsContent value="character">
                <CharacterForm />
              </TabsContent>
              <TabsContent value="episode">
                <EpisodeForm />
              </TabsContent>
            </Tabs>
          </ScrollArea>
          <SheetFooter>
            <Label htmlFor="password">Super Secret Key:</Label>
            <PasswordField state={password} method={setPassword} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminPanel;
