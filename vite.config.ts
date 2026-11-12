import fs from "fs/promises"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { createServer, defineConfig, loadEnv, type Plugin } from "vite"
import { VitePWA } from "vite-plugin-pwa"

// Canonical origin. Vercel 307-redirects the apex domain here, so og:url / canonical must use www
// or Meta's scraper sees a redirect cycle.
const SITE_URL = "https://www.creatormodo.com"

// Shape of src/prerender.tsx (not imported directly: it belongs to the app tsconfig, not this one).
type PrerenderRoute = { path: string; title: string; description: string }
type PrerenderModule = {
  prerenderRoutes: PrerenderRoute[]
  renderRoute: (route: PrerenderRoute) => string
}

const escapeAttr = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")

// Head tags that index.html sets for the homepage and that each prerendered page overrides.
const PAGE_SPECIFIC_META =
  /\s*<meta\s+(?:name|property)="(?:description|og:title|og:description|og:url|twitter:title|twitter:description)"[^>]*>/g

/**
 * Writes dist/<route>.html for the routes in src/prerender.tsx: the built index.html with that
 * page's title/description/og:url/canonical, and the page's markup inside #root so crawlers
 * that don't run JS (Meta App Review, link previews) see the content. React replaces the static
 * markup on load. vercel.json rewrites each route to its file.
 */
function prerenderPublicPages(): Plugin {
  let root = ""
  let outDir = ""

  return {
    name: "prerender-public-pages",
    apply: "build",
    configResolved(config) {
      root = config.root
      outDir = path.resolve(config.root, config.build.outDir)
    },
    async writeBundle() {
      const template = await fs.readFile(path.join(outDir, "index.html"), "utf-8")
      if (!template.includes('<div id="root"></div>')) {
        throw new Error('prerender: built index.html has no empty <div id="root"></div>')
      }

      const server = await createServer({
        configFile: false,
        root,
        logLevel: "error",
        appType: "custom",
        server: { middlewareMode: true, hmr: false, watch: null },
        resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
        // react-router-dom's "node" export only has an ESM build under "module-sync"; without it
        // Vite resolves the CJS build, whose re-exported names (StaticRouter, Link) aren't detected.
        ssr: { resolve: { externalConditions: ["module-sync"] } },
        plugins: [react()],
      })

      try {
        const { prerenderRoutes, renderRoute } = (await server.ssrLoadModule(
          "/src/prerender.tsx",
        )) as PrerenderModule

        for (const route of prerenderRoutes) {
          const url = `${SITE_URL}${route.path}`
          const title = escapeAttr(`${route.title} | CreatorModo`)
          const description = escapeAttr(route.description)
          const head = [
            `<link rel="canonical" href="${url}" />`,
            `<meta name="description" content="${description}" />`,
            `<meta property="og:url" content="${url}" />`,
            `<meta property="og:title" content="${title}" />`,
            `<meta property="og:description" content="${description}" />`,
            `<meta name="twitter:title" content="${title}" />`,
            `<meta name="twitter:description" content="${description}" />`,
          ].join("\n    ")
          const body = renderRoute(route)

          // Function replacers: the rendered markup may contain `$` sequences.
          const html = template
            .replace(PAGE_SPECIFIC_META, "")
            .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title}</title>\n    ${head}`)
            .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`)

          await fs.writeFile(path.join(outDir, `${route.path.slice(1)}.html`), html)
        }
      } finally {
        await server.close()
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: env.VITE_BASE_URL ?? "/",
    plugins: [
      react(),
      tailwindcss(),
      prerenderPublicPages(),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
                },
              }
            }
          ]
        },
        manifest: {
          name: "CreatorModo",
          short_name: "CreatorModo",
          start_url: "/",
          display: "standalone",
          background_color: "#0D1117",
          theme_color: "#0D1117",
          icons: [
            {
              src: "/pwa-icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/pwa-icon-512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable any",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})