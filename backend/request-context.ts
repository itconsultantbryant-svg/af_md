import { AsyncLocalStorage } from "node:async_hooks";
import type { NextRequest } from "next/server";

// Each concurrent invocation gets its own cookie/session context.
export const requestContext = new AsyncLocalStorage<NextRequest>();
