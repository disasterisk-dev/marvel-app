import Elysia, { t } from "elysia";
import bearer from "@elysiajs/bearer";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});

export const uploadRoute = new Elysia({ prefix: "/upload" }).use(bearer()).post(
  "/",
  async ({ body, error, bearer }) => {
    if (bearer !== process.env.API_BEARER) {
      return error(401, {
        status: 401,
        error: "You are not authorized to upload files",
      });
    }

    const res = await utapi.uploadFiles(body.file);

    const url = res.data?.key;

    // const fileBuffer = await body.file.arrayBuffer();
    // const uint8Arr = new Uint8Array(fileBuffer);
    // const buffer = Buffer.from(uint8Arr);

    // const path = "./public/" + body.file.name;
    // await Bun.write(path, buffer);

    return {
      status: 200,
      success: "Image successfully uploaded",
      url: url,
    };
  },
  {
    body: t.Object({
      file: t.File({
        type: "image/jpeg",
      }),
    }),
    response: {
      200: t.Object({
        status: t.Number(),
        success: t.String(),
        url: t.String(),
      }),
      401: t.Object({
        status: t.Number(),
        error: t.String(),
      }),
    },
  }
);
