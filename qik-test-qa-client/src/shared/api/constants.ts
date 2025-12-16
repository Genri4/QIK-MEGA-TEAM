// @ts-ignore
const isLocal = process.env.NODE_ENV ?? "local";

export const BASE_URL =
  isLocal === "production"
    ? "https://87.242.101.112/api/v1"
    : "http://localhost:3004/api/v1";
