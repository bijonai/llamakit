#!/usr/bin/env node

import process from 'node:process'
import { Clerc } from 'clerc'
import { startServer } from './server.js'

export default Clerc.create()
  .name('llamakit')
  .version(process.version)
  .scriptName('llamakit')
  .description('Powerful AI devtools')
  .command('start', 'Start llamakit server.')
  .on('start', async () => {
    await Promise.all([
      startServer({ port: 3000 }),
    ])
  })
  .parse()