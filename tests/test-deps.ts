// url_test.ts
import { assertEquals } from "@std/assert";

const task = (
  str: TemplateStringsArray,
  utility: "Helper" | "Validator" | "Handler",
) => (
  `${utility} -> method (${str[0]})`
);

export { assertEquals, task };
