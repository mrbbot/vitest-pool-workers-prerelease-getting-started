import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        isolatedStorage: true,
        miniflare: {
          kvNamespaces: ["COUNTER"],
        },
        wrangler: {
          configPath: "./wrangler.toml"
        }
      },
    },
  },
});
