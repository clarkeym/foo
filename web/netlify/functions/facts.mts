const API_ENDPOINT = "https://jsonplaceholder.typicode.com/posts";

export default async (_request: Request, _context: any) => {
  try {
    const response = await fetch(API_ENDPOINT);
    const data = (await response.json()) as any[];
    const limitedData = data.slice(0, 2); // Return only the first 5 items for brevity
    return Response.json({ limitedData });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Failed fetching data" }, { status: 500 });
  }
};
