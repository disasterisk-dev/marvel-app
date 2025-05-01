import { entry, episode } from "./types";

export function scrollToTop(document: Document) {
  const element = document.getElementById("top")!;
  element.scrollIntoView({
    block: "start",
    behavior: "smooth",
  });
}

export function formatRuntime(runtime: number): string {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours <= 0) return minutes.toString() + "m";

  return hours.toString() + "h " + minutes.toString() + "m";
}

export function getIds(list: (entry | episode)[]): number[] {
  const ids: number[] = [];

  list.forEach((e) => ids.push(e.id));

  return ids;
}
