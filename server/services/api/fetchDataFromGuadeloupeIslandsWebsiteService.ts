import { cheerio } from "@deps";

const handleHtmlPage = ({
  html,
  host,
  address,
}: {
  html: string;
  host: string;
  address: string;
}) => {
  const data: Record<string, Record<string, string>> = {};
  let index = 0;

  const $ = cheerio.load(html);

  $(".push-tour", html).each(function () {
    const $image = host +
      $(this)
        .children(".picture")
        .children("picture")
        .children("img")
        .attr("src");
    const $title = $(this).children(".text").children("h3").text();
    const $text = $(this).children(".text").children("p").text();

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
  const host = "https://www.lesilesdeguadeloupe.com",
    address = host +
      "/tourisme/fr-fr/circuits/randonneesguadeloupe-lesincontournables";

  const res = await fetch(address);

  if (res.ok && res.status === 200) {
    const data = handleHtmlPage({
      html: await res.text(),
      host,
      address,
    });

    return { data: JSON.stringify(data), status: 200 };
  } else {
    return { data: JSON.stringify({ error: res.statusText }), status: 404 };
  }
};
