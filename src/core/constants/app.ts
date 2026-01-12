export const appMeta = {
  name: "React Starter",
  description: "App description...",

  lang: "id",

  logo: {
    default: `${import.meta.env.BASE_URL}logo.png`,
    withText: `${import.meta.env.BASE_URL}logo-text.png`,
  },
};

export const apiConfig = {
  host: "http://localhost:8000",
  basePath: "/api",

  get baseUrl() {
    return `${this.host}${this.basePath}`;
  },

  get authBaseUrl() {
    return `${this.baseUrl}/auth`;
  },
};
