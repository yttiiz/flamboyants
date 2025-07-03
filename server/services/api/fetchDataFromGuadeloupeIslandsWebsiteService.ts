import { cheerio } from "@deps";

const handleHtmlPage = ({
  html,
  address,
}: {
  html: string;
  address: string;
}) => {
  const data: Record<string, Record<string, string>> = {};
  let index = 0;

  const $ = cheerio.load(html);

  $(".iris-card__wrapper", html).each(function () {
    const $image = $(this)
      .children(".iris-card__media")
      .children(".iris-card__media__background")
      .children("picture")
      .children("img")
      .attr("src");

    const $title = $(this).children(".iris-card__content").children("h3")
      .text();
    const $text = $(this).children(".iris-card__content").children("div")
      .children("p").text();

    if ($title && $image) {
      data[`${index + 1}`] = {
        href: address,
        image: $image,
        text: $text,
        title: $title,
      };

      index++;
    }
  });

  return data;
};

export const fetchDataFromGuadeloupeIslandsWebsiteService = async () => {
  const address =
    "https://www.lesilesdeguadeloupe.com/decouvrir/que-faire-en-guadeloupe/";
  const res = await fetch(address);

  if (res.ok && res.status === 200) {
    const data = handleHtmlPage({
      html: await res.text(),
      address,
    });

    return { data: JSON.stringify(data), status: 200 };
  } else {
    return { data: JSON.stringify({ error: res.statusText }), status: 404 };
  }
};
