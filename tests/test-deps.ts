// url_test.ts
import { assertEquals } from "https://deno.land/std@0.221.0/assert/mod.ts";

const task = (
  str: TemplateStringsArray,
  utility: "Helper" | "Validator" | "Handler",
) => (
  `${utility} -> method (${str[0]})`
);

export { assertEquals, task };
