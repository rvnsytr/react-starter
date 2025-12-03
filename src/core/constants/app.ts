const baseUrl = import.meta.env.BASE_URL;

export const appMeta = {
  name: "React Starter",
  description: "App description...",

  // logo: {
  //   default: `${baseUrl}logo.png`,
  //   withText: `${baseUrl}logo-text.png`,
  // },

  baseUrl,
  lang: "id",

  apiHost: "http://localhost:8000/api/v1",
};
