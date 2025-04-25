import { episode } from "../types";
import { EpisodeItem } from "./EpisodeItem";

type Props = {
  episodes: episode[];
};
export const EpisodeView = ({ episodes }: Props) => {
  return (
    <div className="overflow-scroll p-4">
      {episodes && (
        <>
          <div>
            <h3>Episodes:</h3>
            {episodes.map((e) => (
              <EpisodeItem episode={e} key={e.id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
