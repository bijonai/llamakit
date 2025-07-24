/* eslint-disable no-console */
import process from 'node:process'
import { createDevServer, createNitro, prepare } from 'nitropack'


export async function startServer(params) {
  const { port } = params

  const nitro = await createNitro({
    dev: false,
    rootDir: `${process.cwd()}/packages/server`,
  })

  await prepare(nitro)
  const server = createDevServer(nitro)

  console.info(`[llamakit] Server is running on port ${port}`)
  await server.listen(port)
}
