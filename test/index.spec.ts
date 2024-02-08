import { env, createExecutionContext, getWaitUntil } from "cloudflare:test";
import { describe, it, expect } from "vitest";
// Could import any other source file/function here
import worker from "../src";

// We're going to improve this in the next major version of workers types,
// but for now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("counter", () => {
  it("defaults to zero", async () => {
    const request = new IncomingRequest("http://example.com");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await getWaitUntil(ctx);
    expect(await response.text()).toBe("0");
    expect(await env.COUNTER.get("count")).toBe(null);
  });
  
  it("increments", async () => {
    const request = new IncomingRequest("http://example.com/increment");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await getWaitUntil(ctx);
    expect(await response.text()).toBe("1");
    expect(await env.COUNTER.get("count")).toBe("1");
  });
  
  it("decrements", async () => {
    // `SELF` here points to the worker running in the current isolate.
    // This gets its handler from the `main` option in `vitest.config.ts`.
    // Importantly, it still uses the exact `worker` instance we've imported in\
    // this file as its handler.
    const response = await env.SELF.fetch("http://example.com/decrement");
    expect(await response.text()).toBe("-1"); // Isolation!
    expect(await env.COUNTER.get("count")).toBe("-1");
  });
});
