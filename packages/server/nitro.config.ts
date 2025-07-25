// https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: 'server',
  compatibilityDate: '2025-07-25',
  storage: {
    redis: {
      driver: 'memory', // 开发环境使用内存存储，生产环境可以配置为redis等
    },
  },
  experimental: {
    wasm: true,
  },
})
