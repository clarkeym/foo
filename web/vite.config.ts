import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import facts from "./netlify/functions/facts.mts";
import hello from "./netlify/functions/hello.mts";

const localFunctionsPlugin = {
  name: "local-netlify-functions",
  configureServer(server: {
    middlewares: {
      use: (
        path: string,
        handler: (
          req: import("node:http").IncomingMessage,
          res: import("node:http").ServerResponse,
        ) => void,
      ) => void;
    };
  }) {
    server.middlewares.use("/.netlify/functions/hello", async (req, res) => {
      const request = new Request("http://localhost/.netlify/functions/hello", {
        method: req.method,
      });

      const response = await hello(request, {} as never);
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      res.statusCode = response.status;
      res.end(await response.text());
    });
    server.middlewares.use("/.netlify/functions/facts", async (req, res) => {
      const request = new Request("http://localhost/.netlify/functions/facts", {
        method: req.method,
      });

      const response = await facts(request, {} as never);
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      res.statusCode = response.status;
      res.end(await response.text());
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [localFunctionsPlugin, react()],
});
