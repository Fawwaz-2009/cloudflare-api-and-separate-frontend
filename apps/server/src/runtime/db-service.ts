import { Context, Layer } from "effect";
import { DrizzleDB } from "../db";

export class DbService extends Context.Tag("DbService")<DbService, DrizzleDB>() {}

export const createDbServiceLayer = (db: DrizzleDB) => Layer.succeed(DbService, db);
