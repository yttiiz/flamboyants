//====================================| Deno imports |====================================//
import * as oak from "oak";
import { oakCors } from "cors";
import { MongoStore, Session } from "oak/sessions";
import { load } from "dotenv";
import {
  Bson,
  Collection,
  Database,
  Decimal128,
  Document,
  Filter,
  MongoClient,
  ObjectId,
  UpdateFilter,
} from "mongo";
import { FindCursor } from "findcursor";
import * as bcrypt from "bcrypt";
import * as nodemailer from "nodemailer";
import * as cheerio from "cheerio";

export {
  bcrypt,
  Bson,
  cheerio,
  Collection,
  Database,
  Decimal128,
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
