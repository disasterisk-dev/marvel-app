import { useFilter } from "@/context.ts/FilterContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faSortAlphaDown } from "@fortawesome/free-solid-svg-icons";

const SortOrder = () => {
  const filters = useFilter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button>
            {filters?.sortOrder === "release" && (
              <FontAwesomeIcon icon={faClock} />
            )}
            {filters?.sortOrder === "alphabetical" && (
              <FontAwesomeIcon icon={faSortAlphaDown} />
            )}
            <span className="font-heading">Sort by</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => filters?.setSortOrder("release")}>
            <FontAwesomeIcon icon={faClock} />
            <span>Release date</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => filters?.setSortOrder("alphabetical")}
          >
            <FontAwesomeIcon icon={faSortAlphaDown} />
            <span>Title</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default SortOrder;
