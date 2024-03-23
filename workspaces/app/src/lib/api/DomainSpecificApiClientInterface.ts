export type DomainSpecificApiClientInterface<T extends Record<string, [requestOptions: unknown, response: unknown]>> = {
  [P in keyof T]: (options: T[P][0]) => Promise<T[P][1]>;
} & {
  [P in keyof T & string as `${P}$$key`]: (options: T[P][0]) => T[P][0] & { requestUrl: string };
};
