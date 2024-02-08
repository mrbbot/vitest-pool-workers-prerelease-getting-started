import { defineWorkersPoolOptions, kCurrentWorker } from "@cloudflare/vitest-pool-workers/config";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    pool: "@cloudflare/vitest-pool-workers",
    poolOptions: {
      workers: defineWorkersPoolOptions({
        isolatedStorage: true,
        main: "./src/index.ts", // TypeScript!
        miniflare: {
          kvNamespaces: ["COUNTER"],
          serviceBindings: {
            // Bind to the worker running the tests. This gets its handler from
            // the `main` option above.
            SELF: kCurrentWorker,
          }
        },
      }),
    },
  },
});
