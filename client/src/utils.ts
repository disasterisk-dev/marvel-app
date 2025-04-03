export function scrollToTop(document: Document) {
  const element = document.getElementById("top")!;
  element.scrollIntoView({
    block: "start",
    behavior: "smooth",
  });
}
