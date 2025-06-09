import { Context, Effect, Layer } from "effect";
import { QueueError } from "../errors";

type SendParams = Parameters<Queue["send"]>;

export class QueueService extends Context.Tag("QueueService")<
  QueueService,
  {
    send: (message: SendParams[0], options?: SendParams[1]) => Effect.Effect<void, QueueError>;
  }
>() {}

export const createQueueServiceLayer = (queue: Queue) =>
  Layer.succeed(QueueService, {
    send: (message, options) =>
      Effect.tryPromise({
        try: () => queue.send(message, options),
        catch: (error) => new QueueError({ message: error instanceof Error ? error.message : "Unknown error" }),
      }),
  });
