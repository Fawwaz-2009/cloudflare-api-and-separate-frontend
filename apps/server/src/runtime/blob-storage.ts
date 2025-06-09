import { Context, Effect, Layer } from "effect";
import { BlobStorageError } from "../errors";

type PutParams = Parameters<R2Bucket["put"]>;

export class BlobStorageService extends Context.Tag("BlobStorageService")<
  BlobStorageService,
  {
    get: (key: string) => Effect.Effect<R2ObjectBody | null, BlobStorageError>;
    put: (key: string, value: PutParams[1], options?: PutParams[2]) => Effect.Effect<R2Object | null, BlobStorageError>;
    delete: (keys: string | string[]) => Effect.Effect<void, BlobStorageError>;
  }
>() {}

export const createBlobStorageServiceLayer = (blobStorage: Pick<R2Bucket, "put" | "delete" | "get">) =>
  Layer.succeed(BlobStorageService, {
    get: (key) =>
      Effect.tryPromise({
        try: () => blobStorage.get(key),
        catch: (error) => new BlobStorageError({ message: error instanceof Error ? error.message : "Unknown error" }),
      }),
    put: (key, value, options) =>
      Effect.tryPromise({
        try: () => blobStorage.put(key, value, options),
        catch: (error) => new BlobStorageError({ message: error instanceof Error ? error.message : "Unknown error" }),
      }),
    delete: (keys) =>
      Effect.tryPromise({
        try: () => blobStorage.delete(keys),
        catch: (error) => new BlobStorageError({ message: error instanceof Error ? error.message : "Unknown error" }),
      }),
  });
