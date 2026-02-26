export const appMeta = {
  name: "React Starter",
  description: "App description...",
  lang: "id",

  baseUrl: import.meta.env.PROD
    ? "https://yourdomain.com"
    : "http://localhost:3000",

  logo: {
    default: `${import.meta.env.BASE_URL}logo.png`,
    withText: `${import.meta.env.BASE_URL}logo-text.png`,
  },
};

export const apiConfig = {
  host: import.meta.env.PROD
    ? "https://api.yourdomain.com"
    : "http://localhost:8000",

  basePath: "/api",

  get baseUrl() {
    return `${this.host}${this.basePath}`;
  },
};
