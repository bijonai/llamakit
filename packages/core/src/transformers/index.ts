export interface TransformerOptions {
  baseUrl: string
  apiKey: string
}

export function createTransform<T extends object, R extends object, K extends object = T>(
  _options: TransformerOptions,
): (
  body: T,
  resolver?: (body: T) => K,
  after?: (body: R, o: K, params: object) => K,
) => [
  K,
  (response: R, params: object) => K,
] {
  return (
    body: T,
    resolver: (body: T) => K = (body) => body as unknown as K,
    after: (body: R, o: K, params: object) => K = (body, o) => o,
  ) => {
    return [
      resolver(body),
      (response, params) => after(response, resolver(body), params),
    ]
  }
}

export * from './chat'
