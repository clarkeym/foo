import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  console.log("method:", req);
  console.log("context:", context);
  return new Response("Hello World");
};
