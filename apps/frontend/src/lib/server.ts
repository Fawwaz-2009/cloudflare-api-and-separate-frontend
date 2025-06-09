import type { AppType } from "server";
import { hc } from "hono/client";
import { env } from "@/env";

export const createServerApi = (headers?: Headers) => {
  const newHeaders = new Headers();
  newHeaders.set("cookie", headers?.get("cookie") || "");
  newHeaders.set("Content-Type", headers?.get("Content-Type") || "application/json");
  return hc<AppType>(env.VITE_SERVER_URL!, {
    init: headers
      ? {
          headers: newHeaders,
          credentials: "include",
        }
      : {
          credentials: "include",
        },
  }).api;
};

export type RpcEndpointResponse<T extends (...args: any) => any> = Awaited<ReturnType<Awaited<ReturnType<T>>["json"]>>;
