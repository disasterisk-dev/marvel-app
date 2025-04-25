import { entry } from "@/types";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useList } from "@/context/ListContext";
import { Separator } from "./ui/separator";
import { formatRuntime } from "@/utils";

type Props = {
  entry: entry;
  isShell?: boolean;
};
export const WatchListEntry = ({ entry, isShell = false }: Props) => {
  const { entries, storeEntries } = useList()!;

  function removeFromList() {
    if (entry.medium !== "Show") {
      storeEntries(entries.filter((e) => e.id !== entry.id));
      return;
    }
  }

  return (
    <>
      <div id={"watch-item-" + entry.id} className="h-min">
        <div className="my-2 flex gap-2">
          <div className="max-w-1/3">
            <img
              className="aspect-2/3 w-full"
              src={import.meta.env.VITE_FILE_BASE_URL + entry.posterUrl}
              alt=""
            />
          </div>
          <div className="text-muted-foreground basis-full">
            <h3 className="font-semibold">{entry.title}</h3>
            {!isShell && (
              <span>
                <FontAwesomeIcon icon={faClock} />{" "}
                {formatRuntime(entry.runtime)}
              </span>
            )}
          </div>
          {!isShell && (
            <Button
              variant={"outline"}
              className="text-destructive aspect-square"
              onClick={removeFromList}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
        </div>
        {entry.episodes && (
          <div className="border-muted-foreground border-l-2 pl-4">
            {entry.episodes.map((x) => (
              <div>{x.title}</div>
            ))}
          </div>
        )}
        <Separator className="last:hidden" />
      </div>
    </>
  );
};
