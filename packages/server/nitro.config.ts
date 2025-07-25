// https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: 'server',
  compatibilityDate: '2025-07-25',
  storage: {
    redis: {
      driver: 'memory',
    },
  },
  experimental: {
    wasm: true,
  },
})
