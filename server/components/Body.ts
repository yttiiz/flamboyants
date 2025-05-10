// deno-fmt-ignore-file
import { Helper } from "@utils";
import type { ComponentType, HeadPageDataType } from "./mod.ts";
import { SessionAndDataType } from "@controllers";

const {
  title,
  description,
  openGraph,
} = await Helper.convertJsonToObject<HeadPageDataType>(
  "/server/data/basics/app.json",
);

export const Body: ComponentType<
  "Body",
  (arg: SessionAndDataType) => string
> = {
  name: "Body",
  html: ({
    isAdminInterface,
    }: SessionAndDataType
  ) => {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        ${isAdminInterface
          ? ""
          :
          (
            `
            <meta name="description" content="${description}">
            <meta property="og:title" content="${openGraph?.title}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:type" content="${openGraph?.type}" />
            <meta property="og:url" content="${openGraph?.url}" />
            <meta property="og:image:url" content="${openGraph?.image.url}" />
            <meta property="og:image:type" content="${openGraph?.image.type}" />
            <meta property="og:image:width" content="${openGraph?.image.width}" />
            <meta property="og:image:height" content="${openGraph?.image.height}" />
            `
          )
        }
        <link rel="stylesheet" href="./css/main.css">
        <link rel="stylesheet" href="./css/{{ css }}.css">
        <link rel="icon" href="./img/favicon.svg" type="image/svg+xml">
      </head>
      <body>
        <script>0</script>
        <noscript>
          <h1>
            JavaScript est désactivé sur votre navigateur
          </h1>
          <h4>
            Veuillez activer JavaScript de manière à pouvoir utiliser toutes les fonctionnalités de l'application.
          </h4>
        </noscript>
        {{ application-content }}
        {{ application-script }}
      </body>
      </html>`
  },
};
