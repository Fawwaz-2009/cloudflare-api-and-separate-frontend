import { Layer, ManagedRuntime } from "effect";
import { createDbServiceLayer, DbService } from "./db-service";
import { createDb, DrizzleDB } from "../db";
import { createBlobStorageServiceLayer, BlobStorageService } from "./blob-storage";
import { Context } from "hono";
import { Variables } from "..";
// import { createGoogleGenerativeAI } from "@ai-sdk/google";
// import { GoogleModel } from "./models";
import { createQueueServiceLayer } from "./queue-service";

type C = Context<
  {
    Bindings: CloudflareBindings;
    Variables: Variables;
  },
  "*",
  {}
>;

export const createRuntime = (c: C) => {
  // const googleModel = createGoogleGenerativeAI({
  //   apiKey: c.env.GOOGLE_GENERATIVE_AI_API_KEY,
  // });
  const mainLayer = Layer.mergeAll(
    createDbServiceLayer(c.get("DrizzleDB")),
    // createBlobStorageServiceLayer(c.env.mooz),
    // Layer.succeed(GoogleModel, googleModel),
    // createQueueServiceLayer(c.env.mooz_q),
  );
  return ManagedRuntime.make(mainLayer);
};

export const createQueueRuntime = (env: CloudflareBindings) => {
  // const googleModel = createGoogleGenerativeAI({
  //   apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
  // });
  const mainLayer = Layer.mergeAll(
    createDbServiceLayer(createDb(env.DB)),
    // createBlobStorageServiceLayer(env.mooz),
    // Layer.succeed(GoogleModel, googleModel),
    // createQueueServiceLayer(env.mooz_q),
  );
  return ManagedRuntime.make(mainLayer);
};
