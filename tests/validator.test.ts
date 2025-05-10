import { assertEquals, task } from "./test-deps.ts";
import { Validator } from "../server/utils/mod.ts";

Deno.test({
  name: task`normalise string (NFD)${"Validator"}`,
  fn() {
    assertEquals("aeeui", Validator.normalizeString("àéèùï"));
  },
});

Deno.test({
  name: task`limit dates${"Validator"}`,
  fn() {
    assertEquals({ min: "2024-04-25" }, Validator.limitDates("2024-04-25"));
  },
});

Deno.test({
  name: task`limit age${"Validator"}`,
  fn() {
    const getDate = (num: number) => {
      let [day, month, year] = (
        new Date().toLocaleString("fr-FR").split(" ").at(0) as string
      ).split("/");

      year = `${+year - num}`;
      return `${year}-${month}-${day}`;
    };
    const min = getDate(100), max = getDate(18);
    assertEquals({ min, max }, Validator.limitAge());
  },
});

Deno.test({
  name: task`date parser limiter${"Validator"}`,
  fn() {
    const min = (new Date()
      .toLocaleString("fr-FR")
      .split(" ")
      .at(0) as string)
      .split("/")
      .reverse()
      .join("-");

    assertEquals(`min="${min}"`, Validator.minAndMaxDateParser("test"));
  },
});

Deno.test({
  name: task`form data parser${"Validator"}`,
  fn() {
    const dataModel = {
      action: "/test",
      method: "POST",
      title: "test",
      content: [
        { type: "text" },
        { type: "text" },
      ],
    };

    // Correct fields
    const fields1 = [
      { key: "name", value: "Marcus" },
      { key: "age", value: "45" },
    ];
    const formData1 = new FormData();

    for (const { key, value } of fields1) {
      formData1.append(key, value);
    }

    // Unexpected fields
    const fields2 = [
      {
        key: "name",
        value: '(function(){document.querySelector("body").innerHTML=""})()',
      },
    ];
    const formData2 = new FormData();
    for (const { key, value } of fields2) {
      formData2.append(key, value);
    }

    assertEquals(
      { isOk: true, data: { name: "Marcus", age: "45" } },
      Validator.dataParser(formData1, dataModel),
    );

    assertEquals(
      {
        isOk: false,
        message:
          "Il semble que votre saisie contient : des caractères non autorisés.",
      },
      Validator.dataParser(formData2, dataModel),
    );
  },
});
