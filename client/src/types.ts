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

export interface character {
  id: number;
  name: string;
  actors: string[];
}

export interface episode {
  id: number;
  title: string;
  releaseDate: Date;
  directors: string[];
  runtime: number;
  series: number;
  episodeNumber: number;
}

export interface option {
  readonly value: string | number;
  readonly label: string;
}
