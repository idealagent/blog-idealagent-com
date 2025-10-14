import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { getImage } from "astro:assets"

export const GET: APIRoute = async () => {
  const items = (await getCollection("posts"))
    .sort(
      (a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0),
    )
    .slice(0, 10)
  const jsonData = items.map((item) => {
    return item.data
  })

  return new Response(JSON.stringify(jsonData, null, 2), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
