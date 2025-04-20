import EntryForm from "@/components/forms/EntryForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import CharacterForm from "./forms/CharacterForm";
import { Label } from "./ui/label";
import { PasswordField } from "./forms/fields/PasswordField";
import { EpisodeForm } from "./forms/EpisodeForm";

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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new...</DialogTitle>
            <DialogDescription>
              This super secret panel is only for use by the admin, you can't
              create new entries without the super secret key!
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="entry" className="min-h-full w-full">
            <TabsList>
              <TabsTrigger value="entry">Entry</TabsTrigger>
              <TabsTrigger value="character">Character</TabsTrigger>
              <TabsTrigger value="episode">Episode</TabsTrigger>
            </TabsList>
            <TabsContent value="entry">
              <EntryForm password={password} close={() => setOpen(false)} />
            </TabsContent>
            <TabsContent value="character">
              <CharacterForm password={password} close={() => setOpen(false)} />
            </TabsContent>
            <TabsContent value="episode">
              <EpisodeForm password={password} close={() => setOpen(false)} />
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Label htmlFor="password">Super Secret Key:</Label>
            <PasswordField state={password} method={setPassword} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminPanel;
