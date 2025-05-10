import { assertEquals, task } from "./test-deps.ts";
import { Helper } from "../server/utils/mod.ts";

Deno.test({
  name: task`convert json to object${"Helper"}`,
  async fn() {
    assertEquals(
      { firstname: "Marcus", lastname: "Garvey", age: 45 },
      await Helper.convertJsonToObject("/tests/data.test.json"),
    );
  },
});

Deno.test({
  name: task`formate price${"Helper"}`,
  fn() {
    assertEquals("35,25\xa0€", Helper.formatPrice(35.25));
  },
});

Deno.test({
  name: task`display date${"Helper"}`,
  fn() {
    assertEquals(
      "24 juil. 1980",
      Helper.displayDate({
        date: new Date("1980-7-24"),
        style: "normal",
      }),
    );
  },
});
