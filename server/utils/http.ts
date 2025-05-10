import { oak } from "@deps";
import type { ContentHeadersType } from "./mod.ts";
import type { RouterContextAppType } from "@controllers";

export class Http<T extends string> {
  private ctx: RouterContextAppType<T> | oak.Context;

  constructor(ctx: RouterContextAppType<T> | oak.Context) {
    this.ctx = ctx;
  }

  public setHeaders(...contents: ContentHeadersType[]) {
    for (const { name, value } of contents) {
      this.ctx.response.headers.append(name, value);
    }
    return this;
  }

  public setResponse(
    data: string,
    status: number,
  ) {
    this.ctx.response.body = data;
    this.ctx.response.status = status;
    return this;
  }

  public redirect(url: URL) {
    this.ctx.response.redirect(url);
    return this;
  }
}
