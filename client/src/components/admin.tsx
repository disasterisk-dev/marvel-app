import EntryForm from "@/components/forms/EntryForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
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

const AdminPanel = () => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState<string | undefined>();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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
            <Tabs defaultValue="entry" className="h-min w-full">
              <TabsList>
                <TabsTrigger value="entry">Entry</TabsTrigger>
                <TabsTrigger value="character">Character</TabsTrigger>
                <TabsTrigger value="episode">Episode</TabsTrigger>
              </TabsList>
              <TabsContent value="entry">
                <EntryForm password={password} close={() => setOpen(false)} />
              </TabsContent>
              <TabsContent value="character">
                <CharacterForm
                  password={password}
                  close={() => setOpen(false)}
                />
              </TabsContent>
              <TabsContent value="episode">
                <EpisodeForm password={password} close={() => setOpen(false)} />
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
