export interface TransformerOptions {
  baseUrl: string
  apiKey: string
}

export function createTransform<T extends object, R extends object, K extends object = T>(
  _options: TransformerOptions,
): (
  body: T,
  resolver?: (body: T) => K,
) => [
  K,
  (response: R, params: object) => K,
] {
  return (
    body: T,
    resolver: (body: T) => K = (body) => body as unknown as K,
    after: (body: R, params: object) => K = (body) => body as unknown as K,
  ) => {
    return [
      resolver(body),
      after,
    ]
  }
}
