export type Nullable<T> = T | null;
export type Constructable<Args = unknown[], Result = unknown> = new (args: Args) => Result;
export type Union<T extends string | number | boolean> = `${T}`;
