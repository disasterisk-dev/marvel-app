import { useFilter } from "@/context.ts/FilterContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faClock,
  faSortAlphaDown,
} from "@fortawesome/free-solid-svg-icons";

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
            <span>Sort by</span>
            <FontAwesomeIcon icon={faChevronDown} />
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
      {/* <select
        name=""
        id=""
        value={filters?.sortOrder}
        // @ts-expect-error safe as the only options fit the union type
        onChange={(e) => filters?.setSortOrder(e.target.value)}
        className="mb-2"
      >
        <option value="release">Release Order</option>
        <option value="alpha">Alphabetical Order</option>
      </select> */}
    </>
  );
};

export default SortOrder;
