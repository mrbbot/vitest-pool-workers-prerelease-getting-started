export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    let change = 0;
    if (pathname === "/increment") {
      change = 1;
    } else if (pathname === "/decrement") {
      change = -1;
    } else if (pathname !== "/") {
      return new Response(null, { status: 404 });
    }

    let count = await env.COUNTER.get("count") ?? "0";
    if (change !== 0) {
      count = (parseInt(count) + change).toString();
      await env.COUNTER.put("count", count);
    }
    return new Response(count);
  }
} satisfies ExportedHandler<Env>;
// ^ Using `satisfies` provides type checking/completions for `ExportedHandler`
//   whilst still allowing us to call `worker.fetch()` in tests without
//   asserting `worker.fetch` is defined.
