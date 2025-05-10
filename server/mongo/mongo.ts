import { MongoClient, MongoStore, ObjectId } from "@deps";
import type { Database, Document, Filter, UpdateFilter } from "@deps";
import { Helper } from "@utils";
import {
  CollectionType,
  CreateClusterParamerType,
  SelectFromDBType,
  UpdateItemIntoDBParameterType,
} from "./types.ts";

/**
 * The app MongoDB Manager.
 */
export class Mongo {
  private static client = new MongoClient();
  private static errorMsg = "connexion failed";
  private static clusterUrl: string;
  private static db: Database;

  public static connectionTo<T extends Document = Document>(
    collection: string,
  ): CollectionType<T> {
    const selectedCollection = Mongo.clientConnectTo<T>(collection);

    if (selectedCollection) {
      return selectedCollection.find();
    }

    return { message: Mongo.errorMsg };
  }

  public static async addNewItemIntoDB<T>(
    id: ObjectId,
    data: T,
    collection: string,
    key: string,
  ) {
    return await Mongo.update({
      collection,
      filter: { _id: id },
      update: { $push: { [key]: data } },
    });
  }

  public static async removeItemFromDB<T>(
    id: ObjectId,
    data: T,
    collection: string,
    key: string | number,
  ) {
    return await Mongo.update({
      collection,
      filter: { _id: id },
      update: { $pull: { [key]: data } },
    });
  }

  public static async updateItemIntoDB<T>({
    data,
    collection,
    key,
    itemKey,
    itemValue,
  }: UpdateItemIntoDBParameterType<T>) {
    return await Mongo.update({
      collection,
      filter: { [`${key}.${itemKey}`]: itemValue },
      update: { $set: { [`${key}.$`]: { ...data } } },
    });
  }

  public static async updateToDB<T extends Document>(
    id: ObjectId,
    data: T,
    collection: string,
  ) {
    return await Mongo.update({
      collection,
      filter: { _id: id },
      update: { $set: { ...data } } as unknown as UpdateFilter<T>,
    });
  }

  public static async insertIntoDB<T extends Document>(
    data: T,
    collection: string,
  ) {
    const selectedCollection = Mongo.clientConnectTo<T>(collection);

    if (selectedCollection) {
      const id: ObjectId = await selectedCollection.insertOne(data);
      return id.toHexString();
    }

    return Mongo.errorMsg;
  }

  public static async selectFromDB<T extends Document>(
    collection: string,
    identifier?: string | ObjectId,
    key?: string,
  ): SelectFromDBType<T> {
    const selectedCollection = Mongo.clientConnectTo<T>(collection);
    const filter = typeof identifier === "string"
      ? { [key as string]: identifier } as unknown as Filter<T>
      : { _id: identifier };

    if (selectedCollection) {
      const selectedDocument = await selectedCollection.findOne(filter);

      if (selectedDocument) {
        return selectedDocument;
      }

      const message = collection === "users"
        ? "Aucun utilisateur n'est lié à cet email : " + identifier
        : "Produit non trouvé.";

      return { message };
    }

    return { message: Mongo.errorMsg };
  }

  public static async deleteFromDB<T extends Document>(
    id: ObjectId,
    collection: string,
  ) {
    const selectedCollection = Mongo.clientConnectTo<T>(collection);

    if (selectedCollection) {
      return await selectedCollection.deleteOne({ _id: id });
    }

    return 0;
  }

  public static async setStore(url: string) {
    try {
      const db = await Mongo.client.connect(url);
      return new MongoStore(db, "sessions");
    } catch (error) {
      Helper.writeLog(error);
    }
  }

  private static async update({
    collection,
    filter,
    update,
  }: {
    collection: string;
    filter: Filter<Document>;
    update: UpdateFilter<Document>;
  }) {
    const selectedCollection = Mongo.clientConnectTo(collection);

    if (selectedCollection) {
      const {
        matchedCount,
        modifiedCount,
      } = await selectedCollection.updateOne(filter, update);

      return matchedCount + modifiedCount === 2;
    }

    return false;
  }

  private static clientConnectTo<T extends Document>(collection: string) {
    return Mongo.db.collection<T>(collection);
  }

  public static async createClusterUrl({
    username,
    password,
    host,
    env,
  }: CreateClusterParamerType) {
    Mongo.clusterUrl = env === "local"
      ? "mongodb://localhost:27017/main"
      : `mongodb+srv://${username}:${password}@${host}/main?authMechanism=SCRAM-SHA-1`;

    console.log(Mongo.clusterUrl);

    // Init "main" Database.
    Mongo.db = await Mongo.client.connect(Mongo.clusterUrl);

    return Mongo.clusterUrl;
  }
}
