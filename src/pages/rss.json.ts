import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

export const GET: APIRoute = async () => {
  const items = await getCollection("posts")
  const jsonData = items.map((item) => item.data) // Extract only the data

  return new Response(JSON.stringify(jsonData, null, 2), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
