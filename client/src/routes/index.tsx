import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <section className="max-w-screen-md flex justify-center flex-col mx-auto h-full">
      <h2>Uatu the Rewatcher</h2>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugit culpa
        neque totam ea nobis, rerum, repudiandae, nihil perferendis dicta
        aspernatur ab qui. Labore accusamus delectus sequi quaerat itaque
        similique, expedita rem ducimus sed asperiores, nostrum accusantium
        cumque! Commodi reprehenderit facilis laboriosam quos facere officiis
        magni earum ratione, delectus esse voluptatem.
      </p>
    </section>
  );
}
