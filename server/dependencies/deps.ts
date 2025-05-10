//====================================| Deno imports |====================================//
import * as oak from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { MongoStore, Session } from "https://deno.land/x/oak_sessions/mod.ts";
import { load } from "https://deno.land/std@0.202.0/dotenv/mod.ts";
import {
  Binary,
  Bson,
  Collection,
  Database,
  Decimal128,
  Document,
  Filter,
  MongoClient,
  ObjectId,
  UpdateFilter,
} from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { FindCursor } from "https://deno.land/x/mongo@v0.31.2/src/collection/commands/find.ts";
import { decode, encode } from "https://deno.land/std@0.188.0/encoding/hex.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import * as nodemailer from "npm:nodemailer";
import * as cheerio from "npm:cheerio";

export {
  bcrypt,
  Binary,
  Bson,
  cheerio,
  Collection,
  Database,
  Decimal128,
  decode,
  encode,
  FindCursor,
  load,
  MongoClient,
  MongoStore,
  nodemailer,
  oak,
  oakCors,
  ObjectId,
  Session,
};

export type { Document, Filter, UpdateFilter };
