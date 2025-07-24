// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.nitro/**',
      '**/build/**',
      '**/.nuxt/**',
      '**/.output/**',
    ],
  },
)
