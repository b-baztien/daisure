// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxt/scripts",
    "@pinia/nuxt",
    "@vueuse/nuxt",
  ],

  devtools: {
    enabled: true,
  },

  nitro: {
    preset: "cloudflare-pages",
    cloudflare: {
      wrangler: {
        name: "daisure",
        vars: {
          NODE_VERSION: process.env.NODE_VERSION,
          NUXT_PUBLIC_API_BASE: process.env.NUXT_PUBLIC_API_BASE,
          NUXT_PUBLIC_LINE_CLIENT_ID: process.env.NUXT_PUBLIC_LINE_CLIENT_ID,
          NUXT_PUBLIC_LINE_REDIRECT_URI:
            process.env.NUXT_PUBLIC_LINE_REDIRECT_URI,
        },
      },
      deployConfig: true,
      nodeCompat: true,
    },
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      baseURL: "",
      lineClientId: process.env.NUXT_PUBLIC_LINE_CLIENT_ID || "",
      lineRedirectUri: process.env.NUXT_PUBLIC_LINE_REDIRECT_URI || "",
    },
  },

  app: {
    head: {
      title: "DaiSure - ซื้อขายออนไลน์อย่างปลอดภัย",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "บริการรับฝากเงินค้ำประกันการซื้อขาย ปลอดภัย มั่นใจ ไร้กังวล",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  ui: {
    colorMode: false,
  },

  routeRules: {
    "/": { prerender: true },
  },

  imports: {
    dirs: ["types/**", "composables/**"],
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
