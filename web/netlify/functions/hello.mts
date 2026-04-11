import type { Context } from "@netlify/functions";

export default async (request: Request, context: Context) => {
  console.log("request:", request);
  console.log("context:", context);
  return new Response("Hello World");
};
