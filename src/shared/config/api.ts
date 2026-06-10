export const apiConfig = {
  host: import.meta.env.PROD
    ? "https://api.example.com"
    : "http://localhost:8000",

  basePath: "/api",

  get baseUrl() {
    return `${this.host}${this.basePath}`;
  },
} as const;
