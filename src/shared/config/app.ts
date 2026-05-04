export const appConfig = {
  name: "React Starter",
  description: "App description...",

  defaultLanguage: "id",

  baseUrl: import.meta.env.PROD
    ? "https://yourdomain.com"
    : "http://localhost:3000",

  logo: {
    default: `${import.meta.env.BASE_URL}logo.png`,
    withText: `${import.meta.env.BASE_URL}logo-text.png`,
  },
};
