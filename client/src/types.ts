export interface entry {
  id: number;
  title: string;
  releaseDate: Date;
  runtime: number;
  directors: string[];
  characters: number[];
  medium: "Movie" | "Show" | "Extra";
  posterUrl: string;
  phase: number;
  episodes?: episode[];
}

export function isEntry(object: any): object is entry {
  return "medium" in object;
}

export type character = {
  id: number;
  name: string;
  actors: string[];
};

export type episode = {
  id: number;
  title: string;
  releaseDate: Date;
  directors: string[];
  runtime: number;
  series: number;
  episodeNumber: number;
};

export function isEpisode(object: any): object is episode {
  return "series" in object;
}

export interface option {
  readonly value: string | number;
  readonly label: string;
}
